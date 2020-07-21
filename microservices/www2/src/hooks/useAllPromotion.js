import { useStaticQuery, graphql } from 'gatsby';

const useAllPromotion = () => {
  const { allPromotion } = useStaticQuery(
    graphql`
      query ALL_PROMOTION {
        allPromotion {
          nodes {
            id
            name
            images {
              url
              name
            }
            address
            lotsCount
            isTest
          }
        }
      }
    `,
  );

  return allPromotion.nodes;
};

export default useAllPromotion;
