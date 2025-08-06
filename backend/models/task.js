const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters'],
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending',
  },
  dueDate: {
    type: Date,
    required: [true, 'Please add a due date'],
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent marking tasks complete if due date is in future
TaskSchema.pre('save', function (next) {
  if (this.status === 'completed' && this.dueDate > Date.now()) {
    throw new Error('Cannot mark task as completed before due date');
  }
  next();
});

module.exports = mongoose.model('Task', TaskSchema);