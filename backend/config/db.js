import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/studyhub';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    console.log(` MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠️ MongoDB connection error: ${error.message}`);
    console.log(`ℹ️ StudyHub will run with in-memory / file fallback store if MongoDB is offline.`);
    isConnected = false;
    return false;
  }
};

export const getDbStatus = () => isConnected;
