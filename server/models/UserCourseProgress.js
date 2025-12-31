import mongoose from "mongoose";

const userCourseProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  isEnrolled: {
    type: Boolean,
    default: false
  },
  enrollmentDate: {
    type: Date
  },
  completionPercentage: {
    type: Number,
    default: 0
  },
  completedLessons: [{
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson'
    },
    completedAt: {
      type: Date,
      default: Date.now
    }
  }],
  completedModules: [{
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module'
    },
    completedAt: {
      type: Date,
      default: Date.now
    }
  }],
  currentLesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  score: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  review: {
    type: String
  },
  certificates: [{
    name: String,
    issuedDate: {
      type: Date,
      default: Date.now
    },
    certificateUrl: String
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

userCourseProgressSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const userCourseProgressModel = mongoose.models.UserCourseProgress || mongoose.model('UserCourseProgress', userCourseProgressSchema);

export default userCourseProgressModel;