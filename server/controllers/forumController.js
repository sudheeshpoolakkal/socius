import ForumPost from "../models/forumPostModel.js";
import ForumComment from "../models/forumCommentModel.js";
import User from "../models/userModel.js";

// Create a new post
export const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const author = req.userId; // Assuming user is authenticated and user id is available in req.user

    const post = new ForumPost({
      title,
      content,
      author,
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Error creating post", error });
  }
};

// Get all posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await ForumPost.find()
      .populate("author", "name")
      .populate({
        path: "upvotes",
        select: "_id"
      })
      .populate({
        path: "bookmarks",
        select: "_id"
      })
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
  }
};

// Get a single post by ID
export const getPostById = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.postId)
      .populate("author", "name")
      .populate({
        path: "upvotes",
        select: "_id"
      })
      .populate({
        path: "bookmarks",
        select: "_id"
      });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comments = await ForumComment.find({ post: req.params.postId })
      .populate("author", "name")
      .sort({ createdAt: -1 });

    res.json({ post, comments });
  } catch (error) {
    res.status(500).json({ message: "Error fetching post", error });
  }
};

// Create a new comment
export const createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const author = req.userId; // Assuming user is authenticated and user id is available in req.user
    const post = req.params.postId;

    const comment = new ForumComment({
      content,
      author,
      post,
    });

    await comment.save();

    await ForumPost.findByIdAndUpdate(post, {
      $push: { comments: comment._id },
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Error creating comment", error });
  }
};

// Toggle upvote on a post
export const toggleUpvote = async (req, res) => {
  try {
    const userId = req.userId;
    const postId = req.params.postId;
    
    const post = await ForumPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    const upvoteIndex = post.upvotes.indexOf(userId);
    let updatedPost;
    
    if (upvoteIndex === -1) {
      // Add upvote
      updatedPost = await ForumPost.findByIdAndUpdate(
        postId,
        { $addToSet: { upvotes: userId } },
        { new: true }
      ).populate("author", "name");
    } else {
      // Remove upvote
      updatedPost = await ForumPost.findByIdAndUpdate(
        postId,
        { $pull: { upvotes: userId } },
        { new: true }
      ).populate("author", "name");
    }
    
    res.json({
      post: updatedPost,
      upvoted: upvoteIndex === -1 // true if it's now upvoted, false if removed
    });
  } catch (error) {
    res.status(500).json({ message: "Error toggling upvote", error });
  }
};

// Toggle bookmark on a post
export const toggleBookmark = async (req, res) => {
  try {
    const userId = req.userId;
    const postId = req.params.postId;
    
    const post = await ForumPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    const bookmarkIndex = post.bookmarks.indexOf(userId);
    let updatedPost;
    
    if (bookmarkIndex === -1) {
      // Add bookmark
      updatedPost = await ForumPost.findByIdAndUpdate(
        postId,
        { $addToSet: { bookmarks: userId } },
        { new: true }
      ).populate("author", "name");
    } else {
      // Remove bookmark
      updatedPost = await ForumPost.findByIdAndUpdate(
        postId,
        { $pull: { bookmarks: userId } },
        { new: true }
      ).populate("author", "name");
    }
    
    res.json({
      post: updatedPost,
      bookmarked: bookmarkIndex === -1 // true if it's now bookmarked, false if removed
    });
  } catch (error) {
    res.status(500).json({ message: "Error toggling bookmark", error });
  }
};
