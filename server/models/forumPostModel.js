import mongoose from "mongoose";

const forumPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ForumComment",
    },
  ],
  upvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  }],
  bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("ForumPost", forumPostSchema);
