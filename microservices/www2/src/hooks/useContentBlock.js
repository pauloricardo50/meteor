import { useStaticQuery, graphql } from 'gatsby';
import { getLongLang } from '../utils/languages.js';

const useContentBlock = ({ uid, lang }) => {
  const { prismic } = useStaticQuery(
    graphql`
      query PRISMIC_ALL_CONTENT_BLOCKS {
        prismic {
          allContent_blocks {
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

  const contentBlock = prismic.allContent_blocks.edges.find(
    ({ node }) =>
      node._meta.uid === uid && node._meta.lang === getLongLang(lang),
  );

  return contentBlock?.node?.content || null;
};

export default useContentBlock;
