import React from 'react';
import Post from './Post';

const PostList = ({ posts, onLike, ApiBaseUrl }) => {
  console.log("posts", posts);
  return (
    <div>
      {posts.map((post) => (
        <Post
          key={post._id}
          post={post}
          onLike={onLike}
          ApiBaseUrl={ApiBaseUrl}
        />
      ))}
    </div>
  );
};

export default PostList;
