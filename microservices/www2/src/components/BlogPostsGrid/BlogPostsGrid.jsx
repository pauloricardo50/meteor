import './BlogPostsGrid.scss';

import React, { useContext } from 'react';

import LanguageContext from '../../contexts/LanguageContext';
import useAllBlogPosts from '../../hooks/useAllBlogPosts';
import BlogPostsGridItem from '../BlogPostsGridItem';

const BlogPostsGrid = () => {
  const [language] = useContext(LanguageContext);

  const posts = useAllBlogPosts();

  if (!posts) return null;

  const postsByLang = posts.filter(({ node: post }) =>
    post._meta.lang.includes(language),
  );

  return (
    <div className="blog-posts container">
      {postsByLang.map(({ node: post }) => (
        <BlogPostsGridItem key={post._meta.id} post={post} />
      ))}
    </div>
  );
};

export default BlogPostsGrid;
