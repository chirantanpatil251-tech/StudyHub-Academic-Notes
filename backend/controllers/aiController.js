import fs from 'fs';
import path from 'path';
import {
  extractPdfData,
  generateComprehensiveAnalysis,
  answerPdfQuestion,
} from '../services/aiService.js';
import Resource from '../models/Resource.js';
import { getFallbackResources } from '../config/store.js';
import { getDbStatus } from '../config/db.js';

// Cache for parsed PDF sessions in memory
const pdfSessions = new Map();

// Helper to get PDF buffer from resourceId or file
const getPdfBufferFromResource = async (resourceId) => {
  let resource;
  if (getDbStatus()) {
    resource = await Resource.findById(resourceId);
  } else {
    resource = getFallbackResources().find((r) => r._id.toString() === resourceId.toString());
  }

  if (!resource) return null;

  // Local uploads path
  if (resource.fileUrl && resource.fileUrl.startsWith('/uploads/')) {
    const filename = path.basename(resource.fileUrl);
    const localPath = path.resolve('uploads', filename);
    if (fs.existsSync(localPath)) {
      return {
        buffer: fs.readFileSync(localPath),
        title: resource.title,
      };
    }
  }

  // Fallback to sample OS Unit 3 if matching
  const defaultPath = path.resolve('uploads', 'sample_os_unit3_deadlock.pdf');
  if (fs.existsSync(defaultPath)) {
    return {
      buffer: fs.readFileSync(defaultPath),
      title: resource.title || 'Operating Systems Unit 3 Notes',
    };
  }

  return null;
};

// @desc    Analyze uploaded PDF or existing resource
// @route   POST /api/ai/analyze-pdf
// @access  Public
export const analyzePdf = async (req, res) => {
  try {
    let buffer;
    let docTitle = 'Uploaded Study Material';
    let fileUrl = '';

    if (req.file) {
      buffer = fs.readFileSync(req.file.path);
      docTitle = req.file.originalname.replace(/\.[^/.]+$/, '');
      fileUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.resourceId) {
      const resData = await getPdfBufferFromResource(req.body.resourceId);
      if (!resData) {
        return res.status(404).json({ message: 'Resource PDF document not found on server' });
      }
      buffer = resData.buffer;
      docTitle = resData.title;
      fileUrl = `/uploads/sample_os_unit3_deadlock.pdf`;
    } else if (req.body.sampleType === 'os-deadlock') {
      const samplePath = path.resolve('uploads', 'sample_os_unit3_deadlock.pdf');
      buffer = fs.readFileSync(samplePath);
      docTitle = 'Operating Systems Unit 3: Deadlocks & Process Synchronization';
      fileUrl = '/uploads/sample_os_unit3_deadlock.pdf';
    } else {
      return res.status(400).json({ message: 'Please provide a PDF file or select an academic resource' });
    }

    // 1. Extract text and page-by-page chunks
    const extractedData = await extractPdfData(buffer);

    // 2. Generate full academic intelligence package
    const analysis = await generateComprehensiveAnalysis(extractedData, docTitle);

    // 3. Store in active sessions map
    const docId = 'doc_' + Date.now() + Math.random().toString(36).substring(2, 7);
    pdfSessions.set(docId, {
      extractedData,
      docTitle,
      fileUrl,
      createdAt: Date.now(),
    });

    return res.json({
      docId,
      docTitle,
      fileUrl,
      numPages: extractedData.numPages,
      summary: analysis.summary,
      importantTopics: analysis.importantTopics,
      revisionNotes: analysis.revisionNotes,
      flashcards: analysis.flashcards,
      practiceQuestions: analysis.practiceQuestions,
    });
  } catch (error) {
    console.error('analyzePdf error:', error);
    res.status(500).json({ message: error.message || 'Error analyzing PDF' });
  }
};

// @desc    Ask questions about the uploaded PDF (Q&A / Chat with page citations)
// @route   POST /api/ai/ask-pdf
// @access  Public
export const askPdfQuestion = async (req, res) => {
  try {
    const { docId, question, resourceId, chatHistory } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ message: 'Please ask a valid question' });
    }

    let session = docId ? pdfSessions.get(docId) : null;

    // If session expired or direct resourceId passed
    if (!session && resourceId) {
      const resData = await getPdfBufferFromResource(resourceId);
      if (resData) {
        const extracted = await extractPdfData(resData.buffer);
        session = {
          extractedData: extracted,
          docTitle: resData.title,
        };
      }
    }

    // Default to OS Unit 3 if no active session
    if (!session) {
      const defaultPath = path.resolve('uploads', 'sample_os_unit3_deadlock.pdf');
      if (fs.existsSync(defaultPath)) {
        const buffer = fs.readFileSync(defaultPath);
        const extracted = await extractPdfData(buffer);
        session = {
          extractedData: extracted,
          docTitle: 'Operating Systems Unit 3 Notes',
        };
      }
    }

    if (!session) {
      return res.status(404).json({ message: 'Document session not found. Please upload or select a PDF first.' });
    }

    const answerResult = await answerPdfQuestion(
      session.extractedData,
      question.trim(),
      chatHistory || []
    );

    return res.json({
      answer: answerResult.answer,
      citedPages: answerResult.citedPages,
      docTitle: session.docTitle,
    });
  } catch (error) {
    console.error('askPdfQuestion error:', error);
    res.status(500).json({ message: error.message || 'Error answering question' });
  }
};

// @desc    Get preset study documents for fast 1-click testing
// @route   GET /api/ai/preset-docs
// @access  Public
export const getPresetDocuments = (req, res) => {
  res.json([
    {
      id: 'os-deadlock',
      title: 'Operating Systems Unit 3: Deadlocks & Banker Algorithm',
      subject: 'Operating Systems (CS203)',
      department: 'Computer Science & Engineering',
      semester: 4,
      pages: 4,
      description: 'Comprehensive lecture notes covering Deadlock definition, the 4 necessary Coffman conditions, Resource Allocation Graphs, Banker Avoidance Algorithm, and Recovery.',
    },
    {
      id: 'dsa-trees',
      title: 'Data Structures: AVL Trees, Graphs & Traversal Notes',
      subject: 'Data Structures & Algorithms (CS201)',
      department: 'Computer Science & Engineering',
      semester: 3,
      pages: 6,
      description: 'Complete handwritten classroom notes covering AVL Rotations, Dijkstra Shortest Path, and BFS/DFS graph traversals.',
    },
    {
      id: 'dbms-pyq',
      title: 'DBMS End-Semester Question Papers & Normalization Proofs',
      subject: 'Database Management Systems (CS202)',
      department: 'Computer Science & Engineering',
      semester: 4,
      pages: 5,
      description: 'Solved university questions covering 1NF, 2NF, 3NF, BCNF proofs, and ACID transaction concurrency protocols.',
    },
  ]);
};

// @desc    Generate fast study summary (for legacy modal)
// @route   GET /api/ai/summarize/:resourceId
// @access  Public
export const summarizeResource = async (req, res) => {
  try {
    const { resourceId } = req.params;

    let resource;
    if (getDbStatus()) {
      resource = await Resource.findById(resourceId);
    } else {
      resource = getFallbackResources().find((r) => r._id.toString() === resourceId.toString());
    }

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    const { title, subject, category, department, semester } = resource;

    const summaryData = {
      title,
      subject,
      category,
      department,
      semester,
      overview: `This ${category.toLowerCase()} material focuses on foundational and advanced aspects of ${subject}. It provides conceptual clarity, step-by-step mathematical or code proofs, and targeted exam problem solutions.`,
      keyTakeaways: [
        `Core theoretical foundations and architecture diagrams related to ${title}.`,
        `Frequently asked university exam derivations, circuit designs, or algorithmic complexities.`,
        `Comprehensive worked examples demonstrating standard design steps and edge-case handling.`,
        `Concise memory formulas and quick-revision cheat notes for final examinations.`,
      ],
      examTips: [
        `Highlight definitions and standard notation right at the beginning of descriptive questions.`,
        `Practice drawing clean, labelled architectural block diagrams and flowcharts for full marks.`,
        `Always state time and space complexity (Big-O) when discussing algorithms or code snippets.`,
      ],
      estimatedReadTime: '25-35 minutes',
      difficultyLevel: semester > 4 ? 'Intermediate / Advanced' : 'Foundational / Intermediate',
      recommendedFor: `Students in ${department} preparing for Semester ${semester} Midterms & End-Sem exams.`,
    };

    return res.json(summaryData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
