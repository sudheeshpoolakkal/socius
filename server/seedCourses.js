import Course from './models/Course.js';
import Module from './models/Module.js';
import Lesson from './models/Lesson.js';
import mongoose from 'mongoose';
import 'dotenv/config';

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/Spiritus', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
});

const sampleCourses = [
  {
    title: "Building Self-Discipline",
    description: "Learn practical techniques to build lasting self-discipline and achieve your personal goals.",
    category: "self-discipline",
    level: "beginner",
    duration: 120,
    thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=225&fit=crop",
    prerequisites: ["Basic motivation to improve yourself"],
    outcomes: [
      "Develop consistent daily habits",
      "Resist procrastination effectively",
      "Build strong willpower reserves"
    ],
    concepts: 8,
    rating: 4.5,
    totalEnrollments: 1250,
    isPublished: true
  },
  {
    title: "Yoga for Beginners",
    description: "Start your yoga journey with foundational poses and breathing techniques for physical and mental well-being.",
    category: "yoga",
    level: "beginner",
    duration: 180,
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=225&fit=crop",
    prerequisites: ["Comfortable clothing", "Yoga mat (optional)"],
    outcomes: [
      "Master basic yoga poses",
      "Improve flexibility and balance",
      "Reduce stress and anxiety"
    ],
    concepts: 10,
    rating: 4.7,
    totalEnrollments: 2340,
    isPublished: true
  },
  {
    title: "Mindfulness Meditation",
    description: "Cultivate present-moment awareness and inner peace through guided meditation practices.",
    category: "mindfulness",
    level: "beginner",
    duration: 90,
    thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=225&fit=crop",
    prerequisites: ["Willingness to practice daily"],
    outcomes: [
      "Reduce stress and anxiety",
      "Improve focus and concentration",
      "Enhance emotional regulation"
    ],
    concepts: 7,
    rating: 4.9,
    totalEnrollments: 5800,
    isPublished: true
  },
  {
    title: "Effective Communication Skills",
    description: "Master the art of clear, confident, and persuasive communication in personal and professional settings.",
    category: "communication",
    level: "intermediate",
    duration: 240,
    thumbnail: "https://images.unsplash.com/photo-1583258292688-d0213dc5a3a6?w=400&h=225&fit=crop",
    prerequisites: ["Basic English proficiency"],
    outcomes: [
      "Speak confidently in public",
      "Listen actively and empathetically",
      "Resolve conflicts constructively"
    ],
    concepts: 12,
    rating: 4.6,
    totalEnrollments: 3400,
    isPublished: true
  },
  {
    title: "English Fluency for Beginners",
    description: "Build confidence and fluency in English through practical conversation practice and grammar exercises.",
    category: "language",
    level: "beginner",
    duration: 300,
    thumbnail: "https://images.unsplash.com/photo-1533575770177-45ac4879778d?w=400&h=225&fit=crop",
    prerequisites: ["Basic knowledge of English alphabet"],
    outcomes: [
      "Hold basic conversations",
      "Improve pronunciation",
      "Build vocabulary systematically"
    ],
    concepts: 15,
    rating: 4.4,
    totalEnrollments: 1890,
    isPublished: true
  },
  {
    title: "Building Unshakeable Self-Confidence",
    description: "Overcome self-doubt and develop unshakeable confidence in every area of your life.",
    category: "self-confidence",
    level: "intermediate",
    duration: 150,
    thumbnail: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=225&fit=crop",
    prerequisites: ["Willingness to challenge limiting beliefs"],
    outcomes: [
      "Overcome imposter syndrome",
      "Feel comfortable in social situations",
      "Take calculated risks confidently"
    ],
    concepts: 9,
    rating: 4.7,
    totalEnrollments: 2650,
    isPublished: true
  },
  {
    title: "Mastering Emotional Intelligence",
    description: "Develop a deep understanding of your emotional patterns and learn to navigate complex feelings with grace.",
    category: "emotional-intelligence",
    level: "intermediate",
    duration: 180,
    thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=225&fit=crop",
    prerequisites: ["Self-awareness", "Willingness to grow"],
    outcomes: [
      "Emotional self-awareness",
      "Regulation techniques",
      "Empathy building",
      "Social intelligence"
    ],
    concepts: 11,
    rating: 4.8,
    totalEnrollments: 2100,
    isPublished: true
  },
  {
    title: "Leadership Essentials",
    description: "Master strategies for decisive leadership and guiding teams through challenges with vision and clarity.",
    category: "leadership",
    level: "intermediate",
    duration: 200,
    thumbnail: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=225&fit=crop",
    prerequisites: ["Team management experience helpful"],
    outcomes: [
      "Strategic foresight",
      "Crisis management",
      "Motivating diverse teams",
      "Ethical decision-making"
    ],
    concepts: 10,
    rating: 4.5,
    totalEnrollments: 950,
    isPublished: true
  },
  {
    title: "Creative Problem Solving",
    description: "Enhance your cognitive flexibility and develop innovative solutions to complex challenges.",
    category: "creativity",
    level: "intermediate",
    duration: 105,
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop",
    prerequisites: ["Open mindset"],
    outcomes: [
      "Lateral thinking",
      "Design thinking",
      "Problem-solving frameworks",
      "Innovation mindset"
    ],
    concepts: 9,
    rating: 4.6,
    totalEnrollments: 1990,
    isPublished: true
  },
  {
    title: "Time Management Mastery",
    description: "Master advanced time management techniques to multiply your effectiveness and achieve more with less stress.",
    category: "time-management",
    level: "intermediate",
    duration: 100,
    thumbnail: "https://images.unsplash.com/photo-1501139083538-0139583c060f?w=400&h=225&fit=crop",
    prerequisites: ["Basic productivity awareness"],
    outcomes: [
      "Priority matrices",
      "Time blocking",
      "Energy management",
      "Productivity systems"
    ],
    concepts: 9,
    rating: 4.6,
    totalEnrollments: 2120,
    isPublished: true
  },
  {
    title: "Peak Mental Performance",
    description: "Enhance your cognitive abilities through scientifically-proven methods for memory, focus, and mental clarity.",
    category: "cognitive-performance",
    level: "advanced",
    duration: 170,
    thumbnail: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=225&fit=crop",
    prerequisites: ["Interest in neuroscience"],
    outcomes: [
      "Memory techniques",
      "Neuroplasticity principles",
      "Brain nutrition",
      "Cognitive exercises"
    ],
    concepts: 13,
    rating: 4.8,
    totalEnrollments: 1670,
    isPublished: true
  }
];

const sampleModules = [
  // Building Self-Discipline Modules
  [
    {
      title: "Understanding Self-Discipline",
      description: "Explore the psychology behind self-discipline and why it matters for success.",
      order: 0,
      duration: 30
    },
    {
      title: "Building Better Habits",
      description: "Learn the science of habit formation and how to create positive routines.",
      order: 1,
      duration: 45
    },
    {
      title: "Overcoming Procrastination",
      description: "Practical techniques to overcome the habit of delaying important tasks.",
      order: 2,
      duration: 45
    }
  ],
  // Yoga for Beginners Modules
  [
    {
      title: "Introduction to Yoga",
      description: "Understanding the philosophy and benefits of yoga practice.",
      order: 0,
      duration: 30
    },
    {
      title: "Basic Poses and Alignment",
      description: "Learn foundational yoga poses with proper form.",
      order: 1,
      duration: 60
    },
    {
      title: "Breathing and Meditation",
      description: "Master pranayama breathing techniques and relaxation.",
      order: 2,
      duration: 90
    }
  ]
  // Add more module arrays for other courses as needed
];

const sampleLessons = [
  // Lessons for Building Self-Discipline Course
  [
    // Module 1 lessons
    [
      {
        title: "What is Self-Discipline?",
        description: "Understanding the definition and importance of self-discipline in achieving goals.",
        order: 0,
        type: "video",
        duration: 15,
        content: "Video explaining the concept of self-discipline and real-world examples"
      },
      {
        title: "The Science Behind Self-Control",
        description: "Research-backed insights into how self-discipline works in the brain.",
        order: 1,
        type: "text",
        duration: 20,
        content: "Detailed explanation of the neuroscience of self-control and willpower"
      }
    ],
    // Module 2 lessons
    [
      {
        title: "Habit Stacking Technique",
        description: "Learn how to attach new habits to existing ones for better results.",
        order: 0,
        type: "video",
        duration: 20,
        content: "Demonstration of habit stacking with practical examples"
      },
      {
        title: "Creating Your Habit Plan",
        description: "Practical exercise to design your own habit-building strategy.",
        order: 1,
        type: "exercise",
        duration: 25,
        content: "Worksheet and exercise to plan your new habits"
      }
    ],
    // Module 3 lessons
    [
      {
        title: "Identifying Procrastination Patterns",
        description: "Recognize your personal patterns of delay and avoidance.",
        order: 0,
        type: "text",
        duration: 15,
        content: "Self-assessment to identify your procrastination triggers"
      },
      {
        title: "The 2-Minute Rule",
        description: "A simple technique to overcome small tasks that we tend to avoid.",
        order: 1,
        type: "exercise",
        duration: 30,
        content: "Practice implementing the 2-minute rule in daily life"
      }
    ]
  ],
  // Lessons for Yoga for Beginners Course
  [
    // Module 1 lessons
    [
      {
        title: "History and Philosophy of Yoga",
        description: "Understanding the ancient practice and its modern applications.",
        order: 0,
        type: "text",
        duration: 20,
        content: "Historical overview and philosophical foundations of yoga"
      },
      {
        title: "Benefits of Yoga Practice",
        description: "Physical, mental, and spiritual benefits backed by research.",
        order: 1,
        type: "video",
        duration: 10,
        content: "Video overview of yoga benefits with expert testimonials"
      }
    ],
    // Module 2 lessons
    [
      {
        title: "Mountain Pose and Alignment",
        description: "Master the fundamental standing pose and proper alignment.",
        order: 0,
        type: "video",
        duration: 20,
        content: "Step-by-step instruction for Tadasana (Mountain Pose)"
      },
      {
        title: "Forward Fold and Breathing",
        description: "Learn Uttanasana and synchronize movement with breath.",
        order: 1,
        type: "video",
        duration: 20,
        content: "Demonstration of forward fold with breathing techniques"
      },
      {
        title: "Warrior Poses",
        description: "Build strength and confidence with Warrior I and II.",
        order: 2,
        type: "video",
        duration: 20,
        content: "Detailed instruction for Virabhadrasana I and II"
      }
    ],
    // Module 3 lessons
    [
      {
        title: "Breathing Techniques (Pranayama)",
        description: "Learn foundational breathing exercises for relaxation.",
        order: 0,
        type: "video",
        duration: 30,
        content: "Instruction on basic pranayama techniques"
      },
      {
        title: "Savasana Practice",
        description: "Master the art of deep relaxation and meditation.",
        order: 1,
        type: "audio",
        duration: 60,
        content: "Guided relaxation meditation for deep rest"
      }
    ]
  ]
  // Add more lesson arrays for other courses as needed
];

async function seedCourses() {
  try {
    await Course.deleteMany({});
    await Module.deleteMany({});
    await Lesson.deleteMany({});

    for (let i = 0; i < sampleCourses.length; i++) {
      const courseData = sampleCourses[i];
      
      // Create the course
      const course = new Course(courseData);
      await course.save();
      
      // If we have module data for this course, create modules
      if (sampleModules[i]) {
        for (let j = 0; j < sampleModules[i].length; j++) {
          const moduleData = sampleModules[i][j];
          
          // Create the module
          const module = new Module({
            ...moduleData,
            courseId: course._id
          });
          await module.save();
          
          // Add module to course
          course.modules.push(module._id);
          
          // If we have lesson data for this module, create lessons
          if (sampleLessons[i] && sampleLessons[i][j]) {
            for (let k = 0; k < sampleLessons[i][j].length; k++) {
              const lessonData = sampleLessons[i][j][k];
              
              // Create the lesson
              const lesson = new Lesson({
                ...lessonData,
                moduleId: module._id
              });
              await lesson.save();
              
              // Add lesson to module
              module.lessons.push(lesson._id);
            }
            
            await module.save();
          }
        }
        
        await course.save();
      }
    }

    process.exit(0);
  } catch (error) {
    console.error("Error seeding courses:", error);
    process.exit(1);
  }
}

seedCourses();