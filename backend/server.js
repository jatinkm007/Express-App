const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Post = require('./models/Post');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch((err) => console.error('MongoDB connection error:', err));

// --- ROUTES ---

// 1. Create a new user (With the duplicate check!)
app.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    const newUser = new User({ name, email });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    // Check for Duplicate Email (Code 11000)
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A user with this email already exists!' });
    }
    res.status(400).json({ message: error.message });
  }
});

// 2. Get all users (Helpful for our frontend dropdown)
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// 3. Create a new post linked to a user (Restored!)
app.post('/posts', async (req, res) => {
  try {
    const { title, content, authorId } = req.body;
    const newPost = new Post({ 
      title, 
      content, 
      author: authorId // Assign the User's ObjectId here
    });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(400).json({ message: 'Error creating post', error: error.message });
  }
});

// 4. Retrieve all posts with populated user information
app.get('/posts', async (req, res) => {
  try {
    // The .populate() method replaces the 'author' ObjectId with the actual User document
    const posts = await Post.find().populate('author', 'name email');
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});