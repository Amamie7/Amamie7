import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/main.css'

const PostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const token = localStorage.getItem('token');
        const postResponse = await fetch(`http://127.0.0.1:7000/api/v1/post/${postId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!postResponse.ok) {
          throw new Error('Failed to fetch post');
        }

        const postData = await postResponse.json();
        setPost(postData);

        const commentsResponse = await fetch(`http://127.0.0.1:7000/api/v1/comment/${postId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!commentsResponse.ok) {
          throw new Error('Failed to fetch comments');
        }

        const commentsData = await commentsResponse.json();
        console.log('commentsData', commentsData)
        setComments(commentsData || []);
        console.log('comments', comments)

      } catch (error) {
        console.error('Error fetching post and comments:', error);
      }
    };

    fetchPostAndComments();
  }, [postId, comments]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
    //   let URL = 'http://127.0.0.1:7000/api/v1/comment/666e97357f5b0e44b5fe900c'
    let URL = `http://127.0.0.1:7000/api/v1/comment/${postId}`

    console.log('c URL', URL)
      const response = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ comment }),
      });

      if (!response.ok) {
        throw new Error('Failed to create comment');
      }

      const newComment = await response.json();
      setComments((prevComments) => [newComment, ...prevComments]);
      setComment('');
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div className='post-container'>
      <div className='post-content'>
      <div className='post-details'>
      <h1>Post Details</h1>
      <h3>By: {post.userId.name}</h3>
      <p>{new Date(post.date).toLocaleString()}</p>
      <p>{post.content}</p>
      <p>Likes: {post.likes}</p>


      <div  className='comments'>
        <div>
      <h4>Comments</h4>
      {/* <p>ccc: {comments ? comments[0].content}</p> */}
      <ul >
        {comments.map((comment) => (
          <li key={comment._id} style={{color: '#fff', listStyle: 'none'}}>
           <strong>{comment.userId.name}</strong><br />
            {comment.comment}
            </li>
        ))}
      </ul>
      </div>
      </div>

      </div>
      </div>

      <form onSubmit={handleCommentSubmit}>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment"
          required
          />
        <button type="submit">Comment</button>
      </form>
    </div>
  );
};

export default PostDetail;
