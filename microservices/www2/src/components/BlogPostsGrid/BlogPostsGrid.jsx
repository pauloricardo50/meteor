import React, { useContext } from 'react';
import BlogPostsGridItem from '../BlogPostsGridItem';
import useAllBlogPosts from '../../hooks/use-all-blog-posts';
import LanguageContext from '../../contexts/LanguageContext';
import './BlogPostsGrid.scss';

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
