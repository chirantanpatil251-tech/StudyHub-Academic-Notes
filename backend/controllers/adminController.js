import Resource from '../models/Resource.js';
import User from '../models/User.js';
import Report from '../models/Report.js';
import {
  getFallbackResources,
  setFallbackResources,
  getFallbackUsers,
  getFallbackReports,
} from '../config/store.js';
import { getDbStatus } from '../config/db.js';

// @desc    Get dashboard metrics for admin
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res) => {
  try {
    if (getDbStatus()) {
      const totalStudents = await User.countDocuments({ role: 'student' });
      const totalResources = await Resource.countDocuments();
      const approvedResources = await Resource.countDocuments({ status: 'approved' });
      const pendingResources = await Resource.countDocuments({ status: 'pending' });
      const totalReports = await Report.countDocuments({ status: 'pending' });

      const downloadsAgg = await Resource.aggregate([
        { $group: { _id: null, totalDownloads: { $sum: '$downloads' }, totalViews: { $sum: '$views' } } },
      ]);

      const totalDownloads = downloadsAgg[0]?.totalDownloads || 0;
      const totalViews = downloadsAgg[0]?.totalViews || 0;

      return res.json({
        totalStudents,
        totalResources,
        approvedResources,
        pendingResources,
        totalReports,
        totalDownloads,
        totalViews,
      });
    } else {
      const users = getFallbackUsers();
      const resources = getFallbackResources();
      const reports = getFallbackReports();

      const totalStudents = users.filter((u) => u.role === 'student').length;
      const totalResources = resources.length;
      const approvedResources = resources.filter((r) => r.status === 'approved').length;
      const pendingResources = resources.filter((r) => r.status === 'pending').length;
      const totalReports = reports.filter((r) => r.status === 'pending').length;
      const totalDownloads = resources.reduce((acc, r) => acc + (r.downloads || 0), 0);
      const totalViews = resources.reduce((acc, r) => acc + (r.views || 0), 0);

      return res.json({
        totalStudents,
        totalResources,
        approvedResources,
        pendingResources,
        totalReports,
        totalDownloads,
        totalViews,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all resources for admin review (including pending/rejected)
// @route   GET /api/admin/resources
// @access  Private/Admin
export const getAdminResources = async (req, res) => {
  try {
    if (getDbStatus()) {
      const resources = await Resource.find().sort({ createdAt: -1 });
      return res.json(resources);
    } else {
      return res.json(getFallbackResources());
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve or reject a resource
// @route   PUT /api/admin/resources/:id/status
// @access  Private/Admin
export const updateResourceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    if (getDbStatus()) {
      const resource = await Resource.findById(id);
      if (!resource) return res.status(404).json({ message: 'Resource not found' });

      resource.status = status;
      await resource.save();
      return res.json({ message: `Resource marked as ${status}`, resource });
    } else {
      const resources = getFallbackResources();
      const resource = resources.find((r) => r._id.toString() === id.toString());
      if (!resource) return res.status(404).json({ message: 'Resource not found' });

      resource.status = status;
      return res.json({ message: `Resource marked as ${status}`, resource });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all registered users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    if (getDbStatus()) {
      const users = await User.find().select('-password').sort({ createdAt: -1 });
      return res.json(users);
    } else {
      const users = getFallbackUsers().map(({ password, ...u }) => u);
      return res.json(users);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit report on a resource
// @route   POST /api/reports
// @access  Private
export const submitReport = async (req, res) => {
  try {
    const { resourceId, reason, details, resourceTitle } = req.body;

    if (!resourceId || !reason) {
      return res.status(400).json({ message: 'Resource and reason are required' });
    }

    if (getDbStatus()) {
      const report = await Report.create({
        resource: resourceId,
        resourceTitle: resourceTitle || 'Academic Resource',
        reportedBy: req.user._id,
        reporterName: req.user.name,
        reason,
        details: details || '',
        status: 'pending',
      });
      return res.status(201).json(report);
    } else {
      const newReport = {
        _id: 'rep_' + Date.now() + Math.random().toString(36).substring(2, 6),
        resource: resourceId,
        resourceTitle: resourceTitle || 'Academic Resource',
        reportedBy: req.user._id,
        reporterName: req.user.name,
        reason,
        details: details || '',
        status: 'pending',
        createdAt: new Date(),
      };
      const reports = getFallbackReports();
      reports.unshift(newReport);
      return res.status(201).json(newReport);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reports
// @route   GET /api/admin/reports
// @access  Private/Admin
export const getAdminReports = async (req, res) => {
  try {
    if (getDbStatus()) {
      const reports = await Report.find().sort({ createdAt: -1 });
      return res.json(reports);
    } else {
      return res.json(getFallbackReports());
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update report status (resolve / dismiss)
// @route   PUT /api/admin/reports/:id
// @access  Private/Admin
export const resolveReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (getDbStatus()) {
      const report = await Report.findById(id);
      if (!report) return res.status(404).json({ message: 'Report not found' });

      report.status = status || 'resolved';
      await report.save();
      return res.json({ message: 'Report status updated', report });
    } else {
      const reports = getFallbackReports();
      const report = reports.find((r) => r._id.toString() === id.toString());
      if (!report) return res.status(404).json({ message: 'Report not found' });

      report.status = status || 'resolved';
      return res.json({ message: 'Report status updated', report });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
