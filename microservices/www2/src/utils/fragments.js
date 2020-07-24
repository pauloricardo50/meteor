import { graphql } from 'gatsby';

export const prismicPageFields = graphql`
  fragment prismicPageFields on PRISMIC_Page {
    _linkType
    _meta {
      id
      uid
      type
      lang
    }
    name
    tracking_id
    seo_title
    seo_description
  }
`;

export const prismicPostFields = graphql`
  fragment prismicPostFields on PRISMIC_Post {
    _linkType
    _meta {
      id
      uid
      type
      lang
    }
    title
    tracking_id
    seo_title
    seo_description
  }
`;
