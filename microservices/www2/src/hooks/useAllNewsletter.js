import { useStaticQuery, graphql } from 'gatsby';

const useAllNewsletter = () => {
  const { allNewsletter } = useStaticQuery(
    graphql`
      query ALL_NEWSLETTER {
        allNewsletter {
          nodes {
            id
            sendDate
            title
            url
          }
        }
      }
    `,
  );

  return allNewsletter.nodes;
};

export default useAllNewsletter;
