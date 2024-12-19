import React from 'react';
import { useNavigate } from 'react-router-dom';
import FileRenderer from './FileRenderer';

const Post = ({ post, onLike, ApiBaseUrl }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/post/${post._id}`);
  };

  console.log("post post", post);
  return (
    <div className="post">
      <h3 style={{fontSize: "1.2rem"}}>By: {post?.userId?.name}</h3>
      <p>{new Date(post.date).toLocaleString()}</p>
      <FileRenderer data={post} API_base_url={ApiBaseUrl} />
      <p>{post.content}</p>

      <button onClick={handleViewDetails} style={{padding: ".7rem 1rem", borderRadius: "5px", fontSize: "1.2rem"}}>View Details </button>
      <button onClick={() => onLike(post._id)} style={{padding: ".7rem 1rem", borderRadius: "5px", fontSize: "1.2rem"}}>
        {post.userliked ? "Unlike" : "Like"}
      </button>
      <p>
        Likes: {post.likes}
        <br />
        Comments: {post.comments}
      </p>
    </div>
  );
};

export default Post;
