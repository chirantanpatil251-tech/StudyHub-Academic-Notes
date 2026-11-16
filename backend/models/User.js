import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
    department: {
      type: String,
      required: [true, 'Please select your department'],
      default: 'Computer Science & Engineering',
    },
    semester: {
      type: Number,
      required: [true, 'Please select your semester'],
      min: 1,
      max: 8,
      default: 4,
    },
    bio: {
      type: String,
      default: 'Passionate student sharing and learning academic resources.',
      maxlength: 300,
    },
    avatar: {
      type: String,
      default: '',
    },
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resource',
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
