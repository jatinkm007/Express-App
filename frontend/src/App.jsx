import React, { useState, useEffect } from 'react';
import './App.css';

// Using environment variable for local development
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);

  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');

  useEffect(() => {
    console.log("App mounted, fetching initial data...");
    fetchUsers();
    fetchPosts();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/users`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_URL}/posts`);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting new user...");
    
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: userName, email: userEmail })
      });

      if (response.ok) {
        console.log("User created!");
        setUserName('');
        setUserEmail('');
        fetchUsers(); // refresh the list
      } else {
        console.log("Server rejected user creation.");
        alert('Failed to create user. Email might be taken.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAuthor) {
      alert('You need to select an author first');
      return;
    }

    console.log("Submitting new post...");
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
        console.log("Post created!");
        setPostTitle('');
        setPostContent('');
        setSelectedAuthor('');
        fetchPosts(); // refresh the list
      } else {
        alert('Failed to create post.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container">
      <h1>Mongoose Referencing Demo</h1>

      <div className="forms-wrapper">
        <div className="form-section">
          <h2>Create User</h2>
          <form onSubmit={handleUserSubmit}>
            <input 
              type="text" 
              placeholder="Name" 
              value={userName} 
              onChange={(e) => setUserName(e.target.value)} 
              required 
            />
            <input 
              type="email" 
              placeholder="Email" 
              value={userEmail} 
              onChange={(e) => setUserEmail(e.target.value)} 
              required 
            />
            <button type="submit">Add User</button>
          </form>
        </div>

        <div className="form-section">
          <h2>Create Post</h2>
          <form onSubmit={handlePostSubmit}>
            <input 
              type="text" 
              placeholder="Post Title" 
              value={postTitle} 
              onChange={(e) => setPostTitle(e.target.value)} 
              required 
            />
            <textarea 
              placeholder="Post Content" 
              value={postContent} 
              onChange={(e) => setPostContent(e.target.value)} 
              required 
            />
            <select 
              value={selectedAuthor} 
              onChange={(e) => setSelectedAuthor(e.target.value)} 
              required
            >
              <option value="" disabled>Select an Author</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} 
                </option>
              ))}
            </select>
            <button type="submit">Add Post</button>
          </form>
        </div>
      </div>

      <div className="posts-section">
        <h2>All Posts</h2>
        {posts.length === 0 ? (
          <p>No posts yet. Go make one!</p>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => (
              <div key={post._id} className="post-card">
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                <small>
                  {/* Checking if author exists because populated data might be missing */}
                  <strong>Author:</strong> {post.author ? post.author.name : 'Unknown User'} 
                </small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;