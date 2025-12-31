import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
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
  lessons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  }],
  duration: {
    type: Number, // Duration in minutes
    default: 0
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

moduleSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const moduleModel = mongoose.models.Module || mongoose.model('Module', moduleSchema);

export default moduleModel;