import React, { useState, useEffect } from 'react';
import './App.css';

// Mentor feedback: Vite uses import.meta.env and VITE_ prefix
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);

  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');

  // Load data when page loads
  useEffect(() => {
    console.log("Page loaded. Fetching data from:", API_URL);
    fetchUsers();
    fetchPosts();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/users`);
      const data = await response.json();
      console.log("Users fetched:", data);
      setUsers(data);
    } catch (error) {
      console.error('Fetch users error:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_URL}/posts`);
      const data = await response.json();
      console.log("Posts fetched (should have author data populated):", data);
      setPosts(data);
    } catch (error) {
      console.error('Fetch posts error:', error);
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    console.log("Attempting to add user...");
    
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: userName, email: userEmail })
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Success adding user!");
        setUserName('');
        setUserEmail('');
        fetchUsers(); // get the updated list
      } else {
        console.log("Backend error response:", data);
        // Shows the specific 11000 duplicate email error message from backend
        alert(data.message || 'Failed to create user');
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedAuthor === '') {
      alert('You need to select an author first!');
      return;
    }

    console.log("Attempting to add post...");
    try {
      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: postTitle,
          content: postContent,
          authorId: selectedAuthor 
        })
      });

      if (response.ok) {
        console.log("Success adding post!");
        setPostTitle('');
        setPostContent('');
        setSelectedAuthor('');
        fetchPosts(); // get the updated list
      } else {
        alert('Failed to create post');
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  return (
    <div className="main-container">
      <h1>Mongoose Populate App</h1>

      <div className="form-container">
        <div className="box">
          <h2>1. Add a User</h2>
          <form onSubmit={handleUserSubmit}>
            <label>Name: </label>
            <input 
              type="text" 
              value={userName} 
              onChange={(e) => setUserName(e.target.value)} 
              required 
            />
            <br />
            <label>Email: </label>
            <input 
              type="email" 
              value={userEmail} 
              onChange={(e) => setUserEmail(e.target.value)} 
              required 
            />
            <br />
            <button type="submit">Save User</button>
          </form>
        </div>

        <div className="box">
          <h2>2. Add a Post</h2>
          <form onSubmit={handlePostSubmit}>
            <label>Title: </label>
            <input 
              type="text" 
              value={postTitle} 
              onChange={(e) => setPostTitle(e.target.value)} 
              required 
            />
            <br />
            <label>Content: </label>
            <textarea 
              value={postContent} 
              onChange={(e) => setPostContent(e.target.value)} 
              required 
            />
            <br />
            <label>Author: </label>
            <select 
              value={selectedAuthor} 
              onChange={(e) => setSelectedAuthor(e.target.value)} 
              required
            >
              <option value="">-- Choose Author --</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
            <br />
            <button type="submit">Save Post</button>
          </form>
        </div>
      </div>

      <hr />

      <h2>Posts List</h2>
      {posts.length === 0 ? (
        <p>No posts added yet.</p>
      ) : (
        <div className="post-list">
          {posts.map((post) => (
            <div key={post._id} className="post-item">
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <p className="author-info">
                <strong>Written by:</strong> {post.author ? post.author.name : 'Unknown User'} 
                ({post.author ? post.author.email : 'No email'})
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;