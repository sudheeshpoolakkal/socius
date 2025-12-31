import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  order: {
    type: Number,
    required: true,
    min: 0
  },
  type: {
    type: String,
    enum: ['video', 'text', 'exercise', 'quiz', 'audio'],
    required: true
  },
  content: {
    type: String, // URL for video/audio, text content, or exercise instructions
    default: ''
  },
  duration: {
    type: Number, // Duration in minutes
    default: 0
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  resources: [{
    name: String,
    url: String,
    type: String // 'pdf', 'image', 'document', etc.
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

lessonSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const lessonModel = mongoose.models.Lesson || mongoose.model('Lesson', lessonSchema);

export default lessonModel;