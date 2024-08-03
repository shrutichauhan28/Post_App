const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Define a Post model (assuming Mongoose is used for MongoDB)
const PostSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  content: String,
  imageUrl: String,
  createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model('Post', PostSchema);

// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint to delete a post
app.delete('/posts/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.body.userId; // Assuming the request includes the user's ID

    // Find the post by ID and verify the user owns the post
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.userId.toString() !== userId) {
      return res.status(403).json({ message: 'User not authorized to delete this post' });
    }

    // Delete the post
    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});
module.exports = mongoose.model("post", PostSchema);