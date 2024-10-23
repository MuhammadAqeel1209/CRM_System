// models/Progress.js
import mongoose from 'mongoose';

const ProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // Assuming you have a User model
  },
  linkId: {
    type: String,
    required: true,
  },
  timeSpent: {
    type: Number,
    default: 0, // Time spent in seconds
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});


const Progress = mongoose.models.Progress || mongoose.model('Progress', ProgressSchema);

export default Progress;
