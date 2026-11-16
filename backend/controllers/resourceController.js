import Resource from '../models/Resource.js';
import User from '../models/User.js';
import Review from '../models/Review.js';
import Comment from '../models/Comment.js';
import {
  getFallbackResources,
  setFallbackResources,
  getFallbackReviews,
  getFallbackComments,
  getFallbackUserById,
  getRawFallbackUserById,
} from '../config/store.js';
import { getDbStatus } from '../config/db.js';
import path from 'path';

// @desc    Get all resources with search, filter, and sort
// @route   GET /api/resources
// @access  Public
export const getResources = async (req, res) => {
  try {
    const { keyword, department, semester, subject, category, sort } = req.query;

    if (getDbStatus()) {
      const query = { status: 'approved' };

      if (keyword) {
        query.$or = [
          { title: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
          { subject: { $regex: keyword, $options: 'i' } },
          { tags: { $in: [new RegExp(keyword, 'i')] } },
        ];
      }

      if (department && department !== 'All Departments') {
        query.department = department;
      }

      if (semester && semester !== 'All Semesters') {
        query.semester = Number(semester);
      }

      if (subject && subject !== 'All Subjects') {
        query.subject = subject;
      }

      if (category && category !== 'All Categories') {
        query.category = category;
      }

      let sortOption = { createdAt: -1 };
      if (sort === 'downloads') {
        sortOption = { downloads: -1 };
      } else if (sort === 'rating') {
        sortOption = { rating: -1 };
      } else if (sort === 'oldest') {
        sortOption = { createdAt: 1 };
      }

      const resources = await Resource.find(query).sort(sortOption);
      return res.json(resources);
    } else {
      // Fallback store
      let list = getFallbackResources().filter((r) => r.status === 'approved');

      if (keyword) {
        const kw = keyword.toLowerCase();
        list = list.filter(
          (r) =>
            r.title.toLowerCase().includes(kw) ||
            r.description.toLowerCase().includes(kw) ||
            r.subject.toLowerCase().includes(kw) ||
            (r.tags && r.tags.some((t) => t.toLowerCase().includes(kw)))
        );
      }

      if (department && department !== 'All Departments') {
        list = list.filter((r) => r.department === department);
      }

      if (semester && semester !== 'All Semesters') {
        list = list.filter((r) => Number(r.semester) === Number(semester));
      }

      if (subject && subject !== 'All Subjects') {
        list = list.filter((r) => r.subject === subject);
      }

      if (category && category !== 'All Categories') {
        list = list.filter((r) => r.category === category);
      }

      if (sort === 'downloads') {
        list.sort((a, b) => b.downloads - a.downloads);
      } else if (sort === 'rating') {
        list.sort((a, b) => b.rating - a.rating);
      } else if (sort === 'oldest') {
        list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      } else {
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      return res.json(list);
    }
  } catch (error) {
    console.error('getResources error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single resource by ID with reviews and comments
// @route   GET /api/resources/:id
// @access  Public
export const getResourceById = async (req, res) => {
  try {
    const { id } = req.params;

    if (getDbStatus()) {
      const resource = await Resource.findById(id);
      if (!resource) {
        return res.status(404).json({ message: 'Resource not found' });
      }

      // Increment views count
      resource.views = (resource.views || 0) + 1;
      await resource.save();

      const reviews = await Review.find({ resource: id }).sort({ createdAt: -1 });
      const comments = await Comment.find({ resource: id }).sort({ createdAt: -1 });

      return res.json({ resource, reviews, comments });
    } else {
      const resources = getFallbackResources();
      const resource = resources.find((r) => r._id.toString() === id.toString());
      if (!resource) {
        return res.status(404).json({ message: 'Resource not found' });
      }

      resource.views = (resource.views || 0) + 1;
      const reviews = getFallbackReviews().filter(
        (rv) => rv.resource.toString() === id.toString()
      );
      const comments = getFallbackComments().filter(
        (cm) => cm.resource.toString() === id.toString()
      );

      return res.json({ resource, reviews, comments });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload new resource
// @route   POST /api/resources
// @access  Private
export const uploadResource = async (req, res) => {
  try {
    const {
      title,
      description,
      department,
      semester,
      subject,
      subjectCode,
      category,
      externalLink,
      tags,
    } = req.body;

    if (!title || !department || !semester || !subject || !category) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    let fileUrl = externalLink || '';
    let fileType = 'link';
    let fileSize = 'Link / External';
    let originalFileName = 'external_resource.link';

    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
      const ext = path.extname(req.file.originalname).toLowerCase().replace('.', '');
      fileType = ext || 'pdf';
      fileSize = (req.file.size / (1024 * 1024)).toFixed(2) + ' MB';
      originalFileName = req.file.originalname;
    }

    if (!fileUrl) {
      return res.status(400).json({ message: 'Please upload a file or provide an external resource link' });
    }

    const parsedTags = Array.isArray(tags)
      ? tags
      : typeof tags === 'string'
      ? tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    if (getDbStatus()) {
      const resource = await Resource.create({
        title,
        description: description || '',
        department,
        semester: Number(semester),
        subject,
        subjectCode: subjectCode || '',
        category,
        fileUrl,
        fileType,
        fileSize,
        originalFileName,
        externalLink: externalLink || '',
        tags: parsedTags,
        uploadedBy: req.user._id,
        uploaderName: req.user.name,
        status: 'approved', // Auto-approved for smooth demonstration
        downloads: 0,
        views: 0,
        rating: 5.0,
        totalRatings: 1,
      });

      return res.status(201).json(resource);
    } else {
      const newResource = {
        _id: 'res_' + Date.now() + Math.random().toString(36).substring(2, 6),
        title,
        description: description || '',
        department,
        semester: Number(semester),
        subject,
        subjectCode: subjectCode || '',
        category,
        fileUrl,
        fileType,
        fileSize,
        originalFileName,
        externalLink: externalLink || '',
        tags: parsedTags,
        uploadedBy: req.user._id,
        uploaderName: req.user.name,
        status: 'approved',
        downloads: 0,
        views: 0,
        rating: 5.0,
        totalRatings: 1,
        createdAt: new Date(),
      };

      const current = getFallbackResources();
      current.unshift(newResource);
      setFallbackResources(current);

      return res.status(201).json(newResource);
    }
  } catch (error) {
    console.error('Upload resource error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Download resource & increment counter
// @route   POST /api/resources/:id/download
// @access  Public
export const downloadResource = async (req, res) => {
  try {
    const { id } = req.params;

    if (getDbStatus()) {
      const resource = await Resource.findById(id);
      if (!resource) return res.status(404).json({ message: 'Resource not found' });

      resource.downloads = (resource.downloads || 0) + 1;
      await resource.save();

      return res.json({
        message: 'Download registered',
        downloads: resource.downloads,
        fileUrl: resource.fileUrl,
      });
    } else {
      const resources = getFallbackResources();
      const resource = resources.find((r) => r._id.toString() === id.toString());
      if (!resource) return res.status(404).json({ message: 'Resource not found' });

      resource.downloads = (resource.downloads || 0) + 1;
      return res.json({
        message: 'Download registered',
        downloads: resource.downloads,
        fileUrl: resource.fileUrl,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a resource
// @route   DELETE /api/resources/:id
// @access  Private
export const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;

    if (getDbStatus()) {
      const resource = await Resource.findById(id);
      if (!resource) return res.status(404).json({ message: 'Resource not found' });

      // Check authorization (uploader or admin)
      if (
        resource.uploadedBy.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin'
      ) {
        return res.status(403).json({ message: 'Not authorized to delete this resource' });
      }

      await resource.deleteOne();
      return res.json({ message: 'Resource successfully deleted' });
    } else {
      const resources = getFallbackResources();
      const index = resources.findIndex((r) => r._id.toString() === id.toString());
      if (index === -1) return res.status(404).json({ message: 'Resource not found' });

      const resource = resources[index];
      if (
        resource.uploadedBy.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin'
      ) {
        return res.status(403).json({ message: 'Not authorized to delete this resource' });
      }

      resources.splice(index, 1);
      setFallbackResources(resources);
      return res.json({ message: 'Resource successfully deleted' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle bookmark for current user
// @route   POST /api/resources/:id/bookmark
// @access  Private
export const toggleBookmark = async (req, res) => {
  try {
    const { id } = req.params;

    if (getDbStatus()) {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const isBookmarked = user.bookmarks.some((b) => b.toString() === id.toString());

      if (isBookmarked) {
        user.bookmarks = user.bookmarks.filter((b) => b.toString() !== id.toString());
      } else {
        user.bookmarks.push(id);
      }

      await user.save();
      return res.json({
        bookmarked: !isBookmarked,
        bookmarks: user.bookmarks,
      });
    } else {
      const user = getRawFallbackUserById(req.user._id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      user.bookmarks = user.bookmarks || [];
      const index = user.bookmarks.findIndex((b) => (b._id || b).toString() === id.toString());
      let bookmarked = false;

      if (index > -1) {
        user.bookmarks.splice(index, 1);
        bookmarked = false;
      } else {
        user.bookmarks.push(id);
        bookmarked = true;
      }

      return res.json({
        bookmarked,
        bookmarks: user.bookmarks,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookmarked resources for current user
// @route   GET /api/resources/user/bookmarks
// @access  Private
export const getBookmarks = async (req, res) => {
  try {
    if (getDbStatus()) {
      const user = await User.findById(req.user._id).populate('bookmarks');
      return res.json(user.bookmarks || []);
    } else {
      const user = getFallbackUserById(req.user._id);
      const bookmarkIds = (user && user.bookmarks) || [];
      const allResources = getFallbackResources();
      const saved = allResources.filter((r) => bookmarkIds.includes(r._id.toString()));
      return res.json(saved);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get resources uploaded by current user
// @route   GET /api/resources/user/uploads
// @access  Private
export const getMyUploads = async (req, res) => {
  try {
    if (getDbStatus()) {
      const resources = await Resource.find({ uploadedBy: req.user._id }).sort({ createdAt: -1 });
      return res.json(resources);
    } else {
      const all = getFallbackResources();
      const mine = all.filter((r) => r.uploadedBy.toString() === req.user._id.toString());
      return res.json(mine);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
