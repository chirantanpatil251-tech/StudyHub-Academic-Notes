import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource',
      required: true,
    },
    resourceTitle: {
      type: String,
      default: '',
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reporterName: {
      type: String,
      default: 'Student',
    },
    reason: {
      type: String,
      required: [true, 'Please provide a reason for the report'],
      enum: [
        'Incorrect Subject or Content',
        'Inappropriate or Offensive Material',
        'Broken File / Corrupted Download',
        'Copyright / Duplicate Resource',
        'Other',
      ],
    },
    details: {
      type: String,
      default: '',
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ['pending', 'resolved', 'dismissed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.models.Report || mongoose.model('Report', reportSchema);
export default Report;
