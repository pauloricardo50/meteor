import { graphql, useStaticQuery } from 'gatsby';

const useAllBlogPosts = () => {
  const { allBlogPost } = useStaticQuery(
    graphql`
      query ALL_BLOG_POST {
        allBlogPost(sort: { fields: date, order: DESC }) {
          nodes {
            _meta {
              id
              lang
              type
              uid
            }
            body {
              slice_type
              primary {
                images {
                  url
                }
              }
            }
            date
            title {
              text
              type
            }
          }
        }
      }
    `,
  );

  return allBlogPost.nodes;
};

export default useAllBlogPosts;
