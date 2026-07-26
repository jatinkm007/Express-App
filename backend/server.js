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
  .catch((err) => console.error('MongoDB connection error:', err));

// Basic route for the home page
app.get('/', (req, res) => {
  res.send('My Mongoose API is running successfully on Render!');
});

// --- USER ROUTES ---

// GET /users - Fetch all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users: ' + error.message });
  }
});

// POST /users - Create a new user
app.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    const newUser = new User({ name, email });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    // Check for duplicate key error (MongoDB code 11000)
    if (error.code === 11000) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }
    res.status(400).json({ message: error.message });
  }
});

// --- POST ROUTES ---

// GET /posts - Fetch all posts with populated Author data
app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'name email');
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts: ' + error.message });
  }
});

// POST /posts - Create a new post referencing a User
app.post('/posts', async (req, res) => {
  try {
    const { title, content, authorId, author } = req.body;
    
    const newPost = new Post({
      title,
      content,
      author: authorId || author
    });

    await newPost.save();
    
    // Populate author details before returning response
    const populatedPost = await newPost.populate('author', 'name email');
    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;