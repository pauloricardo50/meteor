import { useStaticQuery, graphql } from 'gatsby';

const useAllGPSStat = () => {
  const { allGpsStat } = useStaticQuery(
    graphql`
      query ALL_GPS_STAT {
        allGpsStat {
          nodes {
            city
            count
            id
            lat
            long
            zipCode
          }
        }
      }
    `,
  );

  return allGpsStat.nodes;
};

export default useAllGPSStat;
