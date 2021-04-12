const express = require("express");
const Post = require("../models/Post.js");
const verify = require("./verifyToken");

const router = express.Router();

// Gets all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    console.log(`Error retrieving posts: ${error}`);
    res.json({ error: error.message });
  }
});

// Get specific post
router.get("/:postId", verify, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    res.json(post);
  } catch (error) {
    console.log(`Error retrieving specific post ${req.params.postId}: ${error}`);
    res.json({ error: error.message });
  }
});

// Submits a post
router.post("/", verify, async (req, res) => {
  try {
    const { title, description, author } = req.body;
    const post = new Post({
      title,
      description,
      author,
    });
    const data = await post.save();
    res.json(data);
  } catch (error) {
    console.log(`Error submitting posts: ${error}`);
    res.json({ error: error.message });
  }
});

// Update a post
router.patch("/:postId", verify, async (req, res) => {
  try {
    const updatedPost = Post.updateOne(
      {
        _id: req.params.postId,
      },
      {
        $set: {
          title: req.body.title,
        },
      }
    );
    res.json(updatedPost);
  } catch (error) {
    console.log(`Error updating specific post ${req.params.postId}: ${error}`);
    res.json({ error: error.message });
  }
});

// Delete a specific post
router.delete("/:postId", verify, async (req, res) => {
  try {
    const removedPost = await Post.remove({
      _id: req.params.postId,
    });
    res.json(removedPost);
  } catch (error) {
    console.log(`Error deleting specific post ${req.params.postId}: ${error}`);
    res.json({ error: error.message });
  }
});

module.exports = router;
