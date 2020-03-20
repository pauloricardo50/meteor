import React from 'react';

import WwwPage from '../WwwPage';

const BlogPostPage = props => {
  const { pageContext } = props;

  return (
    <WwwPage {...props}>
      <h1>This is a blog post</h1>
      <h2>{pageContext.slug}</h2>
    </WwwPage>
  );
};

export default BlogPostPage;
