import React from 'react';
import BlogPostsGridItem from '../BlogPostsGridItem';
import useAllBlogPosts from '../../hooks/use-all-blog-posts';
import './BlogPostsGrid.scss';

const BlogPostsGrid = () => {
  const posts = useAllBlogPosts();
  if (!posts) return null;
  // TODO: since we're using static query, will need to filter by lang here

  return (
    <div className="blog-posts container">
      {posts.map(({ node: post }) => (
        <BlogPostsGridItem key={post._meta.id} post={post} />
      ))}
    </div>
  );
};

export default BlogPostsGrid;
