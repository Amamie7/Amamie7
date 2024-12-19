import React, { useState } from 'react';

const PostForm = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      let URL = 'http://127.0.0.1:7000/api/v1/post/populate';
      
      const formData = new FormData();
      formData.append('content', content);
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }

      console.log('formData', formData)
      const response = await fetch(URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const newPost = await response.json();
      setContent('');
      setFiles([]);
      onPostCreated(newPost);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        required
      />
      <input 
        type="file" 
        multiple 
        onChange={handleFileChange}
      />
      <button type="submit" style={{padding: ".7rem 1rem", borderRadius: "5px", fontSize: "1.2rem"}}>Post</button>
    </form>
  );
};

export default PostForm;
