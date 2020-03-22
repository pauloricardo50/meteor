import React from 'react';

import { graphql } from 'gatsby';
import WwwPage from '../WwwPage';

const ContentfulPage = ({
  data: {
    allContentfulPage: { nodes },
  },
}) => {
  const [{ title, description }] = nodes;

  return (
    <WwwPage title={title} description={description}>
      Hello from ContentfulPage
    </WwwPage>
  );
};

export default ContentfulPage;

export const query = graphql`
  query ContentfulPageQuery($id: String!) {
    allContentfulPage(filter: { id: { eq: $id } }) {
      nodes {
        id
        slug
        title
      }
    }
  }
`;
