import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/neural-chat';

const chatMessageSchema = new mongoose.Schema({
  role: { type: String, required: true, enum: ['user', 'assistant'] },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

let isConnected = false;

export async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return mongoose.connection;
  }

  try {
    const connection = await mongoose.connect(mongoUri);
    isConnected = true;
    return connection;
  } catch (error) {
    console.warn('MongoDB connection failed:', error.message);
    isConnected = false;
    return null;
  }
}

export function isDatabaseConnected() {
  return isConnected;
}
