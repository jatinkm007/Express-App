import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // State for fetching data
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);

  // State for User Form
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  // State for Post Form
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');

  // Fetch initial data on component mount
  useEffect(() => {
    fetchUsers();
    fetchPosts();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://express-app-60sj.onrender.com/users');
      const data = await response.json();
      if (response.ok) {
        setUsers(data);
      } else {
        console.error('Error fetching users:', data.message);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      // FIXED: Updated to Render URL
      const response = await fetch('https://express-app-60sj.onrender.com/posts');
      const data = await response.json();
      if (response.ok) {
        setPosts(data);
      } else {
        console.error('Error fetching posts:', data.message);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  // Handle User Submission
  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      // FIXED: Updated to Render URL
      const response = await fetch('https://express-app-60sj.onrender.com/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: userName, email: userEmail })
      });

      const data = await response.json();

      if (response.ok) {
        setUserName('');
        setUserEmail('');
        fetchUsers();
        alert('User created successfully!');
      } else {
        alert(data.message || 'Failed to create user.');
      }
    } catch (error) {
      console.error('Failed to create user:', error);
      alert('A server error occurred. Is your backend running?');
    }
  };

  // Handle Post Submission
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAuthor) return alert('Please select an author first!');

    try {
      // FIXED: Updated to Render URL
      const response = await fetch('https://express-app-60sj.onrender.com/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: postTitle,
          content: postContent,
          authorId: selectedAuthor
        })
      });

      const data = await response.json();

      if (response.ok) {
        setPostTitle('');
        setPostContent('');
        setSelectedAuthor('');
        fetchPosts();
        alert('Post created successfully!');
      } else {
        alert(data.message || 'Failed to create post.');
      }
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('A server error occurred. Is your backend running?');
    }
  };

  return (
    <div className="container">
      <h1>Mongoose Referencing Demo</h1>

      <div className="forms-wrapper">
        {/* User Creation Form */}
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

        {/* Post Creation Form */}
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
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
            <button type="submit">Add Post</button>
          </form>
        </div>
      </div>

      {/* Display Posts with Populated User Data */}
      <div className="posts-section">
        <h2>All Posts</h2>
        {posts.length === 0 ? (
          <p>No posts available.</p>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => (
              <div key={post._id} className="post-card">
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                <small>
                  <strong>Author:</strong> {post.author ? post.author.name : 'Unknown User'}{' '}
                  ({post.author ? post.author.email : 'N/A'})
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