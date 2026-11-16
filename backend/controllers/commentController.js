import Comment from '../models/Comment.js';
import { getFallbackComments } from '../config/store.js';
import { getDbStatus } from '../config/db.js';

// @desc    Add comment / discussion point on resource
// @route   POST /api/comments/:resourceId
// @access  Private
export const addComment = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Comment text cannot be empty' });
    }

    if (getDbStatus()) {
      const comment = await Comment.create({
        resource: resourceId,
        user: req.user._id,
        userName: req.user.name,
        content: content.trim(),
      });
      return res.status(201).json(comment);
    } else {
      const newComment = {
        _id: 'cm_' + Date.now() + Math.random().toString(36).substring(2, 6),
        resource: resourceId,
        user: req.user._id,
        userName: req.user.name,
        content: content.trim(),
        createdAt: new Date(),
      };
      const comments = getFallbackComments();
      comments.unshift(newComment);
      return res.status(201).json(newComment);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get comments for a resource
// @route   GET /api/comments/:resourceId
// @access  Public
export const getComments = async (req, res) => {
  try {
    const { resourceId } = req.params;

    if (getDbStatus()) {
      const comments = await Comment.find({ resource: resourceId }).sort({ createdAt: -1 });
      return res.json(comments);
    } else {
      const comments = getFallbackComments().filter(
        (c) => c.resource.toString() === resourceId.toString()
      );
      return res.json(comments);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
