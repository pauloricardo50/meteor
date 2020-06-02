import { useStaticQuery, graphql } from 'gatsby';

const useAllCookiesNotifications = () => {
  const { prismic } = useStaticQuery(
    graphql`
      query PRISMIC_ALL_COOKIES_NOTIFICATIONA {
        prismic {
          allCookies_notifications {
            edges {
              node {
                _meta {
                  uid
                  id
                  type
                  lang
                }
                content
              }
            }
          }
        }
      }
    `,
  );

  return prismic.allCookies_notifications.edges;
};

export default useAllCookiesNotifications;
