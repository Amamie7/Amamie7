import React, { createContext, useState } from 'react';

const PostContext = createContext();

const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
 const ApiBaseUrl = "http://localhost:7000/";

  return (
    <PostContext.Provider value={{ posts, setPosts, ApiBaseUrl }}>
      {children}
    </PostContext.Provider>
  );
};

export { PostContext, PostProvider };
