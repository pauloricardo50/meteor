import './RecommendedBlogPosts.scss';

import React, { useContext } from 'react';

import LanguageContext from '../../contexts/LanguageContext';
import { getLanguageData } from '../../utils/languages';
import RecommendedBlogPost from './RecommendedBlogPost';

const RecommendedBlogPosts = ({ currentPost, recentPosts }) => {
  const [language] = useContext(LanguageContext);

  if (!currentPost || !recentPosts) return null;

  // For now, show only 2 most recent posts, excluding the current article
  const recentPostsExcludeCurrent = recentPosts
    .filter(({ node: post }) => post._meta.id !== currentPost._meta.id)
    .slice(0, 2);

  return (
    <div className="recommended-blog-posts container">
      <h2 className="recommended-blog-posts__heading">
        {getLanguageData(language).recommendedArticleHeader}
      </h2>

      <div className="recommended-blog-posts__list">
        {recentPostsExcludeCurrent.map(({ node: post }) => (
          <RecommendedBlogPost key={post._meta.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default RecommendedBlogPosts;
