import getCanton from '../../../utils/zipcodes';
import LoanService from '../../loans/server/LoanService';

const classifiedCities = require('./classifiedCities.json');

export const getStats = ({ cantons = [] }) => {
  const loans = LoanService.fetch({
    $filters: {
      'structureCache.propertyId': { $exists: true },
    },
    structure: { property: { zipCode: 1, country: 1 } },
  });

  const filteredLoans = loans.filter(
    ({ structure }) =>
      structure?.property?.zipCode && structure?.property?.country === 'CH',
  );

  return filteredLoans
    .reduce(
      (
        gpsStats,
        { structure: { property: { zipCode: propertyZipCode } = {} } },
      ) => {
        const city = classifiedCities.find(
          ({ zipCode }) => zipCode === propertyZipCode,
        );

        if (!city) {
          return gpsStats;
        }

        const { closestMainCity } = city;

        const currentStatIndex = gpsStats.findIndex(
          ({ zipCode }) => zipCode === closestMainCity.zipCode,
        );

        if (currentStatIndex !== -1) {
          const [currentStat] = gpsStats.splice(currentStatIndex, 1);

          const { count = 0 } = currentStat;
          return [...gpsStats, { ...currentStat, count: count + 1 }];
        }

        return [...gpsStats, { ...closestMainCity, count: 1 }];
      },
      [],
    )
    .filter(({ zipCode }) => {
      const canton = getCanton(zipCode);
      return cantons.includes(canton);
    });
};
