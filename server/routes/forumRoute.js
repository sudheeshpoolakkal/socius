import express from 'express';
import {
  createPost,
  getAllPosts,
  getPostById,
  createComment,
  toggleUpvote,
  toggleBookmark,
} from '../controllers/forumController.js';
import authUser from '../middlewares/authUser.js';

const router = express.Router();

router.post('/', authUser, createPost);
router.get('/', getAllPosts);
router.get('/:postId', getPostById);
router.post('/:postId/comments', authUser, createComment);
router.put('/:postId/upvote', authUser, toggleUpvote);
router.put('/:postId/bookmark', authUser, toggleBookmark);

export default router;
