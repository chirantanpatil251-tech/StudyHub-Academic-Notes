import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Subject from '../models/Subject.js';
import Resource from '../models/Resource.js';
import Review from '../models/Review.js';
import Comment from '../models/Comment.js';
import Report from '../models/Report.js';
import {
  initialUsers,
  initialSubjects,
  initialResources,
  initialReviews,
  initialComments,
  initialReports,
} from '../config/store.js';

dotenv.config();

const importData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing database collections...');
    await User.deleteMany();
    await Subject.deleteMany();
    await Resource.deleteMany();
    await Review.deleteMany();
    await Comment.deleteMany();
    await Report.deleteMany();

    console.log('Seeding initial data...');
    await User.insertMany(initialUsers);
    await Subject.insertMany(initialSubjects);
    await Resource.insertMany(initialResources);
    await Review.insertMany(initialReviews);
    await Comment.insertMany(initialComments);
    await Report.insertMany(initialReports);

    console.log('Data Imported successfully into MongoDB!');
    process.exit();
  } catch (error) {
    console.error('Data import failed:', error.message);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await User.deleteMany();
    await Subject.deleteMany();
    await Resource.deleteMany();
    await Review.deleteMany();
    await Comment.deleteMany();
    await Report.deleteMany();
    console.log('Data Destroyed from MongoDB!');
    process.exit();
  } catch (error) {
    console.error('Data destruction failed:', error.message);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
