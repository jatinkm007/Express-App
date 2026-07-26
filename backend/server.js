require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const User = require('./models/User');
const Post = require('./models/Post');

const app = express();

app.use(cors());
app.use(express.json());

// Connect to database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas!'))
  .catch((err) => console.log('MongoDB connection failed:', err));

// --- USERS ---

app.get('/users', async (req, res) => {
  console.log("fetching users route hit");
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.log("error getting users", error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

app.post('/users', async (req, res) => {
  console.log("req.body for new user:", req.body);
  try {
    const newUser = new User({ 
      name: req.body.name, 
      email: req.body.email 
    });
    await newUser.save();
    console.log("saved user successfully");
    res.status(201).json(newUser);
  } catch (error) {
    console.log("Failed to save user. Error code:", error.code);
    
    // Mentor feedback: specifically handle duplicate email constraint violation
    if (error.code === 11000) {
      console.log("Duplicate email detected!");
      return res.status(400).json({ message: 'That email is already registered. Please try another one.' });
    }
    
    res.status(400).json({ message: error.message });
  }
});

// --- POSTS ---

app.get('/posts', async (req, res) => {
  console.log("getting posts with populated authors...");
  try {
    // Using populate to replace authorId with actual user data
    const posts = await Post.find().populate('author', 'name email');
    res.json(posts);
  } catch (error) {
    console.log("error getting posts", error);
    res.status(500).json({ message: 'Error fetching posts' });
  }
});

app.post('/posts', async (req, res) => {
  console.log("creating post:", req.body);
  try {
    const newPost = new Post({
      title: req.body.title,
      content: req.body.content,
      author: req.body.authorId
    });

    await newPost.save();
    
    // Populating author details so frontend has the full object right away
    const populatedPost = await newPost.populate('author', 'name email');
    res.status(201).json(populatedPost);
  } catch (error) {
    console.log("error saving post:", error);
    res.status(400).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});