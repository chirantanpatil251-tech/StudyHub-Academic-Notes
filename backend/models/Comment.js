import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Comment content cannot be empty'],
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema);
export default Comment;
