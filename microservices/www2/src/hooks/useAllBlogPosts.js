/*
  HOOK: useAllBlogPosts
  PURPOSE: A hook to run a static query to retrieve all blog posts
*/
import { useStaticQuery, graphql } from 'gatsby';

const useAllBlogPosts = () => {
  const { prismic } = useStaticQuery(
    graphql`
      query PRISMIC_ALL_POSTS {
        prismic {
          allPosts(sortBy: date_DESC) {
            edges {
              node {
                _meta {
                  id
                  uid
                  tags
                  type
                  lang
                  alternateLanguages {
                    id
                    uid
                    type
                    lang
                  }
                }
                title
                date
                author {
                  ... on PRISMIC_Blog_post_author {
                    name
                    title
                    profile_photo
                  }
                }
                body {
                  ... on PRISMIC_PostBodyHero {
                    type
                    primary {
                      section_id
                      image_layout
                      images
                    }
                  }
                  ... on PRISMIC_PostBodyQuote {
                    type
                    primary {
                      quote
                      quote_source
                    }
                  }
                  ... on PRISMIC_PostBodyText {
                    type
                    primary {
                      section_id
                      justification
                      content
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
  );

  return prismic.allPosts.edges;
};

export default useAllBlogPosts;
