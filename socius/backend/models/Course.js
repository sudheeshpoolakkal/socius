const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: [true, 'Lesson title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Lesson description is required']
  },
  type: {
    type: String,
    required: [true, 'Lesson type is required'],
    enum: ['video', 'text', 'audio', 'exercise']
  },
  duration: {
    type: Number, // in minutes
    required: [true, 'Lesson duration is required']
  },
  content: {
    type: String, // For text or exercise content
    default: ''
  },
  videoUrl: {
    type: String, // For video lessons
    default: ''
  },
  audioUrl: {
    type: String, // For audio lessons
    default: ''
  }
}, { _id: false });

const moduleSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: [true, 'Module title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Module description is required']
  },
  duration: {
    type: Number, // in minutes
    required: [true, 'Module duration is required']
  },
  lessons: [lessonSchema]
});

const courseSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [100, 'Course title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    maxlength: [1000, 'Course description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Course category is required'],
    trim: true
  },
  level: {
    type: String,
    required: [true, 'Course level is required'],
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  duration: {
    type: Number, // in minutes
    required: [true, 'Course duration is required']
  },
  totalEnrollments: {
    type: Number,
    default: 0
  },
  enrolledUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: []
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  ratingCount: {
    type: Number,
    default: 0
  },
  instructor: {
    type: String,
    required: [true, 'Instructor name is required'],
    trim: true
  },
  thumbnail: {
    type: String,
    default: ''
  },
  modules: [moduleSchema],
  prerequisites: [{
    type: String,
    default: []
  }],
  outcomes: [{
    type: String,
    required: [true, 'Learning outcomes are required']
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', courseSchema);