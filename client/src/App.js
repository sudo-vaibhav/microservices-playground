import React from 'react';
import PostCreate from './PostCreate';
import PostList from './PostList';
const Blog = () => {
  return (
    <div className="container">
      <h1>Create Post</h1>
      <PostCreate />
      <h1>Posts</h1>
      <PostList />
    </div>
  );
};

export default Blog;
