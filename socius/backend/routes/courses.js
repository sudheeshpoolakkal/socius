const express = require('express');
const { auth, adminAuth } = require('../middleware/auth');
const Course = require('../models/Course');
const User = require('../models/User');

const router = express.Router();

// @route   GET api/courses
// @desc    Get all courses
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, search, level, sort } = req.query;
    
    let query = {};
    
    // Add filters
    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (level) {
      query.level = level;
    }
    
    // Build sort object
    let sortObj = {};
    if (sort === 'newest') {
      sortObj.createdAt = -1;
    } else if (sort === 'popular') {
      sortObj.totalEnrollments = -1;
    } else if (sort === 'rating') {
      sortObj.rating = -1;
    } else if (sort === 'duration') {
      sortObj.duration = 1;
    } else {
      sortObj.createdAt = -1; // default
    }
    
    const courses = await Course.find(query).sort(sortObj);
    
    res.json({
      success: true,
      count: courses.length,
      courses
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET api/courses/:id
// @desc    Get course by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    
    res.json({
      success: true,
      course
    });
  } catch (error) {
    console.error(error.message);
    
    // Check if it's a valid ObjectId format
    if (error.name === 'CastError') {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST api/courses
// @desc    Create a new course (Admin only)
// @access  Private - Admin only
router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const {
      _id,
      title,
      description,
      category,
      level,
      duration,
      instructor,
      thumbnail,
      modules,
      prerequisites,
      outcomes
    } = req.body;
    
    // Validate required fields
    if (!title || !description || !category || !level || !duration || !instructor || !modules || !outcomes) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, description, category, level, duration, instructor, modules, and outcomes'
      });
    }
    
    // Validate modules
    for (const module of modules) {
      if (!module._id || !module.title || !module.description || !module.lessons) {
        return res.status(400).json({
          success: false,
          message: 'Each module must have _id, title, description, and lessons'
        });
      }
      
      for (const lesson of module.lessons) {
        if (!lesson._id || !lesson.title || !lesson.description || !lesson.type || !lesson.duration) {
          return res.status(400).json({
            success: false,
            message: 'Each lesson must have _id, title, description, type, and duration'
          });
        }
      }
    }
    
    // Check if course with _id already exists
    const existingCourse = await Course.findById(_id);
    if (existingCourse) {
      return res.status(400).json({ success: false, message: 'Course with this ID already exists' });
    }
    
    // Create new course
    const course = new Course({
      _id,
      title,
      description,
      category,
      level,
      duration,
      instructor,
      thumbnail: thumbnail || '',
      modules,
      prerequisites: prerequisites || [],
      outcomes
    });
    
    await course.save();
    
    res.status(201).json({
      success: true,
      course,
      message: 'Course created successfully'
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT api/courses/:id
// @desc    Update a course (Admin only)
// @access  Private - Admin only
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      level,
      duration,
      instructor,
      thumbnail,
      modules,
      prerequisites,
      outcomes
    } = req.body;
    
    // Find the course
    let course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    
    // Update course fields
    if (title) course.title = title;
    if (description) course.description = description;
    if (category) course.category = category;
    if (level) course.level = level;
    if (duration) course.duration = duration;
    if (instructor) course.instructor = instructor;
    if (thumbnail !== undefined) course.thumbnail = thumbnail;
    if (modules) course.modules = modules;
    if (prerequisites !== undefined) course.prerequisites = prerequisites;
    if (outcomes) course.outcomes = outcomes;
    
    // Update the updated_at timestamp
    course.updatedAt = Date.now();
    
    await course.save();
    
    res.json({
      success: true,
      course,
      message: 'Course updated successfully'
    });
  } catch (error) {
    console.error(error.message);
    
    // Check if it's a valid ObjectId format
    if (error.name === 'CastError') {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE api/courses/:id
// @desc    Delete a course (Admin only)
// @access  Private - Admin only
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    
    res.json({
      success: true,
      message: 'Course removed successfully'
    });
  } catch (error) {
    console.error(error.message);
    
    // Check if it's a valid ObjectId format
    if (error.name === 'CastError') {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST api/courses/enroll
// @desc    Enroll in a course
// @access  Private
router.post('/enroll', auth, async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;
    
    if (!courseId) {
      return res.status(400).json({ success: false, message: 'Course ID is required' });
    }
    
    // Use atomic update to prevent race conditions and duplicate enrollments
    const result = await Course.updateOne(
      { 
        _id: courseId,
        enrolledUsers: { $ne: userId } // Only update if user is not already enrolled
      },
      { 
        $inc: { totalEnrollments: 1 }, // Increment enrollment count atomically
        $addToSet: { enrolledUsers: userId } // Add user to enrolledUsers array if not already present
      }
    );
    
    if (result.matchedCount === 0) {
      // Either course doesn't exist or user is already enrolled
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found' });
      }
      // User is already enrolled
      return res.status(400).json({ success: false, message: 'User is already enrolled in this course' });
    }
    
    res.json({
      success: true,
      message: 'Successfully enrolled in course'
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET api/courses/my-courses
// @desc    Get user's enrolled courses
// @access  Private
router.get('/my-courses', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const courses = await Course.find({ 
      enrolledUsers: { $in: [userId] } 
    }).select('-enrolledUsers'); // Don't return the enrolledUsers array to reduce response size
    
    res.json({
      success: true,
      enrolledCourses: courses
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;