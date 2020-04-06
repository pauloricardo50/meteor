import React from 'react';
import { graphql } from 'gatsby';

import WwwPage from '../WwwPage';

const ContentfulPage = props => {
  const {
    data: {
      contentfulPage: { title, description },
    },
  } = props;

  return (
    <WwwPage title={title} description={description}>
      <h1>{title}</h1>
    </WwwPage>
  );
};

export default ContentfulPage;

export const query = graphql`
  query ContentfulPageQuery($id: String!) {
    contentfulPage(id: { eq: $id }) {
      title
      description
    }
  }
`;
