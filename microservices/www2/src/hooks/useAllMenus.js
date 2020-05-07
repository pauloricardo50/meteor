import { useStaticQuery, graphql } from 'gatsby';

const useAllMenus = () => {
  const { prismic } = useStaticQuery(
    graphql`
      query PRISMIC_ALL_MENUS {
        prismic {
          allMenus {
            edges {
              node {
                _meta {
                  id
                  uid
                  type
                  lang
                }
                menu_links {
                  label
                  link {
                    ... on PRISMIC__ExternalLink {
                      _linkType
                      url
                    }
                    ... on PRISMIC_Page {
                      _linkType
                      _meta {
                        id
                        uid
                        type
                        lang
                      }
                      name
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

  return prismic.allMenus.edges;
};

export default useAllMenus;
