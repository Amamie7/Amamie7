import React, { useEffect, useContext } from 'react';
import PostList from '../components/Posts/PostList';
import PostForm from '../components/Posts/PostForm';
import { PostContext } from '../contexts/PostContext';
import '../styles/main.css'

const Home = () => {
  const { posts, setPosts, ApiBaseUrl } = useContext(PostContext);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:7000/api/v1/post', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      const data = await response.json();
      setPosts(data.posts || data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const URL = `http://127.0.0.1:7000/api/v1/likes/${postId}`;
      const response = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 400) {
          const errorMessage = await response.json();
          alert(errorMessage.message);
          throw new Error(errorMessage.message);
        } else {
          alert('Failed to like post');
          throw new Error('Failed to like post');
        }
      }

      const updatedPost = await response.json();

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === updatedPost._id ? updatedPost : post
        )
      );
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  return (
    <div className="home-container">
      <div className="post-form-container">
        <PostForm onPostCreated={handlePostCreated} />
      </div>
      <div className="post-list-container">
        <PostList posts={posts} onLike={handleLike} ApiBaseUrl={ApiBaseUrl} />
      </div>
    </div>
  );
};

export default Home;
