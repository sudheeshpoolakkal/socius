import mongoose from "mongoose";

const forumCommentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ForumPost",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("ForumComment", forumCommentSchema);
