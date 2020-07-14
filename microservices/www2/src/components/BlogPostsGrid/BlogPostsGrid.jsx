import './BlogPostsGrid.scss';

import React, { useContext } from 'react';

import FormattedMessage from 'core/components/Translation/FormattedMessage';

import useBlogPostsContext from '../../contexts/BlogPostsContext';
import LanguageContext from '../../contexts/LanguageContext';
import Button from '../Button';
import BlogPostsGridItem from './BlogPostsGridItem';

const BlogPostsGrid = () => {
  const [language] = useContext(LanguageContext);
  const { posts, loadMore, hasNextPage } = useBlogPostsContext();

  if (!posts) {
    return null;
  }

  const postsByLang = posts.filter(({ node: post }) =>
    post._meta.lang.includes(language),
  );

  return (
    <div className="container">
      <div className="blog-posts">
        {postsByLang.map(({ node: post }) => (
          <BlogPostsGridItem key={post._meta.id} post={post} />
        ))}
      </div>

      <div className="blog-posts-more">
        {hasNextPage ? (
          <Button onClick={loadMore} primary raised>
            <FormattedMessage id="blogLoadMore" />
          </Button>
        ) : (
          <p className="secondary">
            <FormattedMessage id="blogEnd" />
          </p>
        )}
      </div>
    </div>
  );
};

export default BlogPostsGrid;
