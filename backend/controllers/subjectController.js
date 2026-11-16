import Subject from '../models/Subject.js';
import { getFallbackSubjects } from '../config/store.js';
import { getDbStatus } from '../config/db.js';

// @desc    Get all subjects, optionally filtered by department and semester
// @route   GET /api/subjects
// @access  Public
export const getSubjects = async (req, res) => {
  try {
    const { department, semester } = req.query;

    if (getDbStatus()) {
      const query = {};
      if (department) query.department = department;
      if (semester) query.semester = Number(semester);

      const subjects = await Subject.find(query).sort({ semester: 1, name: 1 });
      return res.json(subjects);
    } else {
      let subjects = getFallbackSubjects();
      if (department) {
        subjects = subjects.filter((s) => s.department === department);
      }
      if (semester) {
        subjects = subjects.filter((s) => Number(s.semester) === Number(semester));
      }
      return res.json(subjects);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
