import LoanService from '../../loans/server/LoanService';

const classifiedCities = require('./classifiedCities.json');

export const getStats = ({ romandyOnly = true }) => {
  const loans = LoanService.fetch({
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
          ({ zipCode }) => Number(zipCode) === Number(propertyZipCode),
        );

        if (!city) {
          return gpsStats;
        }

        const { closestMainCity } = city;

        const currentStatIndex = gpsStats.findIndex(
          ({ zipCode }) => Number(zipCode) === Number(closestMainCity.zipCode),
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
    .filter(({ skip }) => (romandyOnly ? !skip : true))
    .map(({ skip, ...rest }) => rest);
};
