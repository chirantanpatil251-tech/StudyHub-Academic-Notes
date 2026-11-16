import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide subject name'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Please provide subject code'],
      uppercase: true,
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Please provide department'],
    },
    semester: {
      type: Number,
      required: [true, 'Please specify semester (1-8)'],
      min: 1,
      max: 8,
    },
    description: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: 'BookOpen',
    },
  },
  {
    timestamps: true,
  }
);

const Subject = mongoose.models.Subject || mongoose.model('Subject', subjectSchema);
export default Subject;
