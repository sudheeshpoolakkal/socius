import Course from '../models/Course.js';
import Module from '../models/Module.js';
import Lesson from '../models/Lesson.js';
import UserCourseProgress from '../models/UserCourseProgress.js';
import User from '../models/userModel.js';

// Create a new course (admin functionality)
const createCourse = async (req, res) => {
  try {
    const { title, description, category, level, thumbnail, fee, prerequisites, outcomes, modules, concepts, instructor } = req.body;

    const course = new Course({
      title,
      description,
      category,
      level: level?.toLowerCase(),
      thumbnail,
      fee,
      instructor,
      prerequisites: prerequisites || [],
      outcomes: outcomes || [],
      concepts: concepts || 0,
      isPublished: true // Initially set to published for demo purposes
    });

    await course.save();

    // If modules are provided, create them
    if (modules && Array.isArray(modules)) {
      for (const moduleData of modules) {
        const module = new Module({
          courseId: course._id,
          title: moduleData.title,
          description: moduleData.description,
          order: moduleData.order,
          duration: moduleData.duration
        });
        
        await module.save();
        course.modules.push(module._id);
        
        // If lessons are provided for this module, create them
        if (moduleData.lessons && Array.isArray(moduleData.lessons)) {
          for (const lessonData of moduleData.lessons) {
            const lesson = new Lesson({
              moduleId: module._id,
              title: lessonData.title,
              description: lessonData.description,
              order: lessonData.order,
              type: lessonData.type || 'text',
              content: lessonData.content,
              duration: lessonData.duration,
              resources: lessonData.resources || []
            });
            
            await lesson.save();
          }
        }
      }
      await course.save();
    }

    // Populate the modules with their lessons for the response
    const populatedCourse = await Course.findById(course._id)
      .populate({
        path: 'modules',
        populate: {
          path: 'lessons'
        }
      });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      course: populatedCourse
    });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating course',
      error: error.message,
      fullError: error
    });
  }
};

// Get all courses with optional category filter
const getAllCourses = async (req, res) => {
  try {
    const { category, limit, search, level, sort } = req.query;
    let filter = {}; // Only return published courses

    if (req.query.published !== 'all') {
      filter.isPublished = true;
    }

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (level) {
      filter.level = level.toLowerCase();
    }

    // Determine sort order
    let sortOption = { createdAt: -1 }; // Default: newest
    if (sort === 'popular') {
      sortOption = { totalEnrollments: -1 };
    } else if (sort === 'rating') {
      sortOption = { rating: -1 };
    } else if (sort === 'duration') {
      sortOption = { duration: 1 };
    }

    const courses = await Course.find(filter)
      .populate('modules')
      .sort(sortOption);

    const limitedCourses = limit ? courses.slice(0, parseInt(limit)) : courses;

    res.status(200).json({
      success: true,
      courses: limitedCourses,
      count: limitedCourses.length
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching courses',
      error: error.message
    });
  }
};

// Get all courses for admin (with full module/lesson details)
const getAllCoursesForAdmin = async (req, res) => {
  try {
    const { category, limit, search, level, sort } = req.query;
    let filter = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (level) {
      filter.level = level.toLowerCase();
    }

    // Determine sort order
    let sortOption = { createdAt: -1 }; // Default: newest
    if (sort === 'popular') {
      sortOption = { totalEnrollments: -1 };
    } else if (sort === 'rating') {
      sortOption = { rating: -1 };
    } else if (sort === 'duration') {
      sortOption = { duration: 1 };
    }

    const courses = await Course.find(filter)
      .populate({
        path: 'modules',
        populate: {
          path: 'lessons'
        }
      })
      .sort(sortOption);

    const limitedCourses = limit ? courses.slice(0, parseInt(limit)) : courses;

    res.status(200).json({
      success: true,
      courses: limitedCourses,
      count: limitedCourses.length
    });
  } catch (error) {
    console.error('Error fetching courses for admin:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching courses for admin',
      error: error.message
    });
  }
};

// Get a specific course by ID
const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId)
      .populate({
        path: 'modules',
        populate: {
          path: 'lessons'
        }
      });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      course
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching course',
      error: error.message
    });
  }
};

// Enroll user in a course
const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id; // Assuming user is authenticated via middleware

    // Check if user is already enrolled
    let userProgress = await UserCourseProgress.findOne({ 
      userId, 
      courseId 
    });

    if (userProgress) {
      if (userProgress.isEnrolled) {
        return res.status(400).json({
          success: false,
          message: 'User already enrolled in this course'
        });
      }
      
      // Update existing record (re-enrollment - don't increment totalEnrollments)
      userProgress.isEnrolled = true;
      userProgress.enrollmentDate = new Date();
      await userProgress.save();
    } else {
      // Create new enrollment
      userProgress = new UserCourseProgress({
        userId,
        courseId,
        isEnrolled: true,
        enrollmentDate: new Date()
      });
      await userProgress.save();
      
      // Only increment enrollment count for new enrollments
      await Course.findByIdAndUpdate(
        courseId,
        { $inc: { totalEnrollments: 1 } },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Successfully enrolled in course',
      userProgress
    });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({
      success: false,
      message: 'Error enrolling in course',
      error: error.message
    });
  }
};

// Get enrolled courses for a user
const getUserEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user is authenticated via middleware

    const userProgresses = await UserCourseProgress.find({ 
      userId, 
      isEnrolled: true 
    })
      .populate({
        path: 'courseId',
        populate: {
          path: 'modules'
        }
      })
      .populate('currentLesson');

    const enrolledCourses = userProgresses.map(progress => ({
      ...progress.toObject(),
      course: progress.courseId
    }));

    res.status(200).json({
      success: true,
      enrolledCourses
    });
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching enrolled courses',
      error: error.message
    });
  }
};

// Update lesson progress
const updateLessonProgress = async (req, res) => {
  try {
    const { courseId, lessonId, completed } = req.body;
    const userId = req.user.id; // Assuming user is authenticated via middleware

    // Find or create user progress record
    let userProgress = await UserCourseProgress.findOne({ 
      userId, 
      courseId 
    });

    if (!userProgress) {
      return res.status(404).json({
        success: false,
        message: 'User not enrolled in this course'
      });
    }

    if (completed) {
      // Check if lesson is already completed
      const isAlreadyCompleted = userProgress.completedLessons.some(lesson => 
        lesson.lessonId.toString() === lessonId
      );

      if (!isAlreadyCompleted) {
        userProgress.completedLessons.push({
          lessonId,
          completedAt: new Date()
        });

        // Update current lesson
        userProgress.currentLesson = lessonId;
      }
    } else {
      // Remove lesson from completed lessons if it was marked as completed
      userProgress.completedLessons = userProgress.completedLessons.filter(lesson => 
        lesson.lessonId.toString() !== lessonId
      );
    }

    // Calculate completion percentage
    const course = await Course.findById(courseId).populate('modules');
    let totalLessons = 0;
    let completedLessons = userProgress.completedLessons.length;

    for (const module of course.modules) {
      const lessons = await Lesson.find({ moduleId: module._id });
      totalLessons += lessons.length;
    }

    userProgress.completionPercentage = totalLessons > 0 
      ? Math.round((completedLessons / totalLessons) * 100) 
      : 0;

    // Update completed modules if all lessons in a module are completed
    for (const module of course.modules) {
      const lessons = await Lesson.find({ moduleId: module._id });
      const completedLessonIds = userProgress.completedLessons.map(lesson => lesson.lessonId.toString());
      const allLessonsCompleted = lessons.every(lesson => 
        completedLessonIds.includes(lesson._id.toString())
      );

      if (allLessonsCompleted) {
        const isModuleAlreadyCompleted = userProgress.completedModules.some(m => 
          m.moduleId.toString() === module._id.toString()
        );

        if (!isModuleAlreadyCompleted) {
          userProgress.completedModules.push({
            moduleId: module._id,
            completedAt: new Date()
          });
        }
      }
    }

    await userProgress.save();

    res.status(200).json({
      success: true,
      message: 'Lesson progress updated successfully',
      userProgress
    });
  } catch (error) {
    console.error('Error updating lesson progress:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating lesson progress',
      error: error.message
    });
  }
};

// Get user progress for a specific course
const getUserCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id; // Assuming user is authenticated via middleware

    const userProgress = await UserCourseProgress.findOne({ 
      userId, 
      courseId 
    })
      .populate('completedLessons.lessonId')
      .populate('completedModules.moduleId')
      .populate('currentLesson');

    if (!userProgress) {
      return res.status(404).json({
        success: false,
        message: 'No progress found for this course'
      });
    }

    res.status(200).json({
      success: true,
      userProgress
    });
  } catch (error) {
    console.error('Error fetching user course progress:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user course progress',
      error: error.message
    });
  }
};

// Get available course categories
const getCourseCategories = async (req, res) => {
  try {
    const categories = [
      { name: 'Emotional Mastery', value: 'emotional-intelligence', count: 0 },
      { name: 'Visionary Leadership', value: 'leadership', count: 0 },
      { name: 'Inner Stillness', value: 'mindfulness', count: 0 },
      { name: 'Artful Communication', value: 'communication', count: 0 },
      { name: 'Creative Alchemy', value: 'creativity', count: 0 },
      { name: 'Self-Discipline', value: 'self-discipline', count: 0 },
      { name: 'Time Management', value: 'time-management', count: 0 },
      { name: 'Cognitive Excellence', value: 'cognitive-performance', count: 0 },
      { name: 'Yoga Practice', value: 'yoga', count: 0 },
      { name: 'Meditation', value: 'meditation', count: 0 },
      { name: 'Language Fluency', value: 'language', count: 0 },
      { name: 'Self-Confidence', value: 'self-confidence', count: 0 },
      { name: 'Stress Management', value: 'stress-management', count: 0 },
      { name: 'Goal Setting', value: 'goal-setting', count: 0 },
      { name: 'Self-Improvement', value: 'self-improvement', count: 0 },
      { name: 'Productivity', value: 'productivity', count: 0 },
      { name: 'Health & Fitness', value: 'health-fitness', count: 0 },
      { name: 'Personal Development', value: 'personal-development', count: 0 }
    ];

    // Count courses in each category
    for (let i = 0; i < categories.length; i++) {
      const count = await Course.countDocuments({ 
        category: categories[i].value,
        isPublished: true
      });
      categories[i].count = count;
    }

    res.status(200).json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Error fetching course categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching course categories',
      error: error.message
    });
  }
};

// Update a course (admin functionality)
const updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, category, level, thumbnail, fee, instructor, prerequisites, outcomes, isPublished, modules, concepts } = req.body;

    // Update course basic info
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { 
        title, 
        description, 
        category, 
        level: level?.toLowerCase(), 
        thumbnail, 
        fee,
        instructor,
        prerequisites, 
        outcomes, 
        isPublished,
        concepts: concepts || 0
      },
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // If modules are provided, update them
    if (modules && Array.isArray(modules)) {
      // First delete existing modules and their lessons
      await Module.deleteMany({ courseId: updatedCourse._id });
      
      // Create new modules and lessons
      for (const moduleData of modules) {
        const module = new Module({
          courseId: updatedCourse._id,
          title: moduleData.title,
          description: moduleData.description,
          order: moduleData.order,
          duration: moduleData.duration
        });
        
        await module.save();
        updatedCourse.modules.push(module._id);
        
        // If lessons are provided for this module, create them
        if (moduleData.lessons && Array.isArray(moduleData.lessons)) {
          for (const lessonData of moduleData.lessons) {
            const lesson = new Lesson({
              moduleId: module._id,
              title: lessonData.title,
              description: lessonData.description,
              order: lessonData.order,
              type: lessonData.type || 'text',
              content: lessonData.content,
              duration: lessonData.duration,
              resources: lessonData.resources || []
            });
            
            await lesson.save();
          }
        }
      }
      await updatedCourse.save();
    }

    // Populate the modules with their lessons for the response
    const populatedCourse = await Course.findById(updatedCourse._id)
      .populate({
        path: 'modules',
        populate: {
          path: 'lessons'
        }
      });

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      course: populatedCourse
    });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating course',
      error: error.message
    });
  }
};

// Delete a course (admin functionality)
const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Find the course to get its modules before deletion
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Delete all modules associated with the course
    const modules = await Module.find({ courseId: course._id });
    for (const module of modules) {
      // Delete all lessons associated with each module
      await Lesson.deleteMany({ moduleId: module._id });
    }
    
    // Delete all modules
    await Module.deleteMany({ courseId: course._id });
    
    // Delete the course itself
    await Course.findByIdAndDelete(courseId);

    res.status(200).json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting course',
      error: error.message
    });
  }
};

export {
  createCourse,
  getAllCourses,
  getCourseById,
  enrollInCourse,
  getUserEnrolledCourses,
  updateLessonProgress,
  getUserCourseProgress,
  getCourseCategories,
  updateCourse,
  deleteCourse,
  getAllCoursesForAdmin
};