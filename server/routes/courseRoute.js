import express from 'express';
import {
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
} from '../controllers/courseController.js';
import authUser from '../middlewares/authUser.js';
import authAdmin from '../middlewares/authAdmin.js';

const courseRouter = express.Router();

// Public routes
courseRouter.get('/', getAllCourses);
courseRouter.get('/categories', getCourseCategories);

// Admin routes (these need to be defined before the general :courseId route)
courseRouter.get('/admin', authAdmin, getAllCoursesForAdmin);
courseRouter.get('/admin/:courseId', authAdmin, getCourseById);

// Admin modification routes
courseRouter.post('/create', authAdmin, createCourse);
courseRouter.put('/:courseId', authAdmin, updateCourse);
courseRouter.delete('/:courseId', authAdmin, deleteCourse);

// Public course details route (must come after more specific routes like /admin)
courseRouter.get('/:courseId', getCourseById);

// Protected routes (require authentication)
courseRouter.post('/enroll', authUser, enrollInCourse);
courseRouter.get('/my-courses', authUser, getUserEnrolledCourses);
courseRouter.post('/progress', authUser, updateLessonProgress);

// This route must also come after /admin/:courseId
courseRouter.get('/:courseId/progress', authUser, getUserCourseProgress);

export default courseRouter;