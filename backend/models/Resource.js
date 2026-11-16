import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      default: '',
      maxlength: 1000,
    },
    department: {
      type: String,
      required: [true, 'Please select department'],
    },
    semester: {
      type: Number,
      required: [true, 'Please select semester'],
      min: 1,
      max: 8,
    },
    subject: {
      type: String,
      required: [true, 'Please provide subject name'],
    },
    subjectCode: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Please select category'],
      enum: [
        'Handwritten Notes',
        'Previous Year Papers',
        'Lab Manuals',
        'PPT Slides',
        'Syllabus & Reference',
        'Tutorials & Code',
        'Video Lectures',
      ],
    },
    fileUrl: {
      type: String,
      required: [true, 'Resource file or link is required'],
    },
    fileType: {
      type: String,
      default: 'pdf',
    },
    fileSize: {
      type: String,
      default: '1.2 MB',
    },
    originalFileName: {
      type: String,
      default: 'document.pdf',
    },
    externalLink: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    uploaderName: {
      type: String,
      default: 'Student Contributor',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved',
    },
    downloads: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 1,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Add index for search
resourceSchema.index({ title: 'text', description: 'text', subject: 'text', tags: 'text' });

const Resource = mongoose.models.Resource || mongoose.model('Resource', resourceSchema);
export default Resource;
