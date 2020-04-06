import React from 'react';
import { graphql } from 'gatsby';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

import WwwPage from '../WwwPage';

const BlogPostPage = props => {
  const {
    data: {
      contentfulBlogPost: {
        title,
        date,
        excerpt,
        content: { json },
      },
    },
  } = props;

  return (
    <WwwPage title={title} description={excerpt.excerpt}>
      <h1>{title}</h1>
      <div>{documentToReactComponents(json)}</div>
    </WwwPage>
  );
};

export default BlogPostPage;

export const query = graphql`
  query ContentfulBlogPostPageQuery($id: String!) {
    contentfulBlogPost(id: { eq: $id }) {
      title
      date
      excerpt {
        excerpt
      }
      content {
        json
      }
    }
  }
`;
