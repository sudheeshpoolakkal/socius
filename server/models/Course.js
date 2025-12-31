import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    required: true,
    enum: [
      'self-discipline', 
      'yoga', 
      'meditation', 
      'communication', 
      'language', 
      'self-confidence', 
      'stress-management',
      'goal-setting',
      'self-improvement',
      'productivity',
      'health-fitness',
      'personal-development',
      'time-management',
      'mindfulness',
      'emotional-intelligence',
      'leadership',
      'creativity',
      'cognitive-performance',
      'other'
    ]
  },
  instructor: { 
    type: String, 
    default: 'Spiritus Experts' 
  },
  duration: { 
    type: Number, // Total duration in minutes
    default: 0
  },
  level: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  thumbnail: { 
    type: String 
  },
  fee: { 
    type: Number, // Course fee
    default: 0
  },
  rating: { 
    type: Number, 
    default: 0 
  },
  ratingCount: { 
    type: Number, 
    default: 0 
  },
  totalEnrollments: { 
    type: Number, 
    default: 0 
  },
  isPublished: { 
    type: Boolean, 
    default: false 
  },
  modules: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Module'
  }],
  prerequisites: [{ 
    type: String 
  }], // Array of prerequisite skills or courses
  outcomes: [{ 
    type: String 
  }], // Array of learning outcomes
  concepts: {
    type: Number,
    default: 0
  }, // Number of core concepts in the course
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

courseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const courseModel = mongoose.models.Course || mongoose.model('Course', courseSchema);

export default courseModel;