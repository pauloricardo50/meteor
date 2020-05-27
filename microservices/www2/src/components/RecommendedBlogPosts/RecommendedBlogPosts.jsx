import React, { useContext } from 'react';
import RecommendedBlogPost from './RecommendedBlogPost';
import useAllBlogPosts from '../../hooks/useAllBlogPosts';
import LanguageContext from '../../contexts/LanguageContext';
import { getLanguageData } from '../../utils/languages';
import './RecommendedBlogPosts.scss';

const RecommendedBlogPosts = ({ currentPost }) => {
  const [language] = useContext(LanguageContext);
  const posts = useAllBlogPosts();

  if (!posts) return null;

  const postsByLang = posts.filter(({ node: post }) =>
    post._meta.lang.includes(language),
  );

  // For now, show only 2 most recent posts, excluding the current article
  const recentPosts = postsByLang
    .filter(({ node: post }) => post._meta.id !== currentPost._meta.id)
    .slice(0, 2);

  // TODO: add tag filtering logic once tag library is known

  return (
    <div className="recommended-blog-posts container">
      <h2 className="recommended-blog-posts__heading">
        {getLanguageData(language).recommendedArticleHeader}
      </h2>

      <div className="recommended-blog-posts__list">
        {recentPosts.map(({ node: post }) => (
          <RecommendedBlogPost key={post._meta.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default RecommendedBlogPosts;
