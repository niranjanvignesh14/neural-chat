import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/neural-chat';

/**
 * Chat message schema with timestamps and role validation
 */
const chatMessageSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    enum: ['user', 'assistant'],
    index: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 10000
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

export const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

let isConnected = false;

/**
 * Establishes connection to MongoDB with retry logic
 * @returns {Promise<Object|null>} Mongoose connection or null if failed
 */
export async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return mongoose.connection;
  }

  try {
    const connection = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    return connection;
  } catch (error) {
    console.warn('MongoDB connection failed:', error.message);
    isConnected = false;
    return null;
  }
}

/**
 * Checks if database is currently connected
 * @returns {boolean} Connection status
 */
export function isDatabaseConnected() {
  return isConnected && mongoose.connection.readyState === 1;
}
