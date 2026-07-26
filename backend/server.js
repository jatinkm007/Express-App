require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const User = require('./models/User');
const Post = require('./models/Post');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.log('Uh oh, MongoDB connection error:', err));

// --- USER ROUTES ---

// GET all users
app.get('/users', async (req, res) => {
  console.log("Fetching all users...");
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.log("Error in GET /users", error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// POST new user
app.post('/users', async (req, res) => {
  console.log("Creating user with body:", req.body);
  try {
    const newUser = new User({ 
      name: req.body.name, 
      email: req.body.email 
    });
    await newUser.save();
    console.log("User saved:", newUser);
    res.status(201).json(newUser);
  } catch (error) {
    // Mentor feedback: Simplified error handling
    console.log("Failed to save user:", error);
    res.status(400).json({ message: error.message });
  }
});

// --- POST ROUTES ---

// GET all posts and populate the author
app.get('/posts', async (req, res) => {
  console.log("Fetching posts and populating authors...");
  try {
    // Populating author data here!
    const posts = await Post.find().populate('author', 'name email');
    res.json(posts);
  } catch (error) {
    console.log("Error in GET /posts", error);
    res.status(500).json({ message: 'Error fetching posts' });
  }
});

// POST new post
app.post('/posts', async (req, res) => {
  console.log("Creating post with body:", req.body);
  try {
    const newPost = new Post({
      title: req.body.title,
      content: req.body.content,
      author: req.body.authorId
    });

    await newPost.save();
    
    // populating author details so frontend can show them immediately
    const populatedPost = await newPost.populate('author', 'name email');
    res.status(201).json(populatedPost);
  } catch (error) {
    console.log("Failed to save post:", error);
    res.status(400).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is up and listening on port ${PORT}`);
});