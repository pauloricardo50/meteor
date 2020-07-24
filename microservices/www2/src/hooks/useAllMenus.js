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
                  tags
                  lang
                }
                menu_name
                nav {
                  __typename
                  ... on PRISMIC_MenuNavMenu_link {
                    type
                    label
                    primary {
                      label
                      link {
                        _linkType
                        __typename
                        ... on PRISMIC_Page {
                          ...prismicPageFields
                        }
                      }
                    }
                    fields {
                      sub_label
                      sub_link {
                        _linkType
                        __typename
                        ... on PRISMIC_Page {
                          ...prismicPageFields
                        }
                      }
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
