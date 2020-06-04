import getCanton from '../../../utils/zipcodes';
import LoanService from '../../loans/server/LoanService';

const classifiedCities = require('./classifiedCities.json');

export const getStats = ({ cantons = [] }) => {
  const loans = LoanService.fetch({
    $filters: { 'structureCache.propertyId': { $exists: true } },
    structureCache: { propertyId: 1 },
    properties: { zipCode: 1, country: 1 },
  });

  const filteredLoans = loans
    .map(({ structureCache: { propertyId }, properties }) =>
      properties.find(({ _id }) => _id === propertyId),
    )
    .filter(property => property?.country === 'CH');

  const mainCities = filteredLoans.reduce(
    (gpsStats, { zipCode: propertyZipCode }) => {
      const city = classifiedCities[propertyZipCode];

      if (!city) {
        return gpsStats;
      }

      const { closestMainCity } = city;
      const currentValue = gpsStats[closestMainCity.zipCode];

      if (currentValue?.count) {
        return {
          ...gpsStats,
          [closestMainCity.zipCode]: {
            ...closestMainCity,
            count: currentValue.count + 1,
          },
        };
      }

      return {
        ...gpsStats,
        [closestMainCity.zipCode]: { ...closestMainCity, count: 1 },
      };
    },
    {},
  );

  return Object.keys(mainCities)
    .filter(zipCode => cantons.includes(getCanton(zipCode)))
    .map(zipCode => mainCities[zipCode]);
};

export const getCitiesFromZipCode = ({ zipCode = '' }) => {
  const cities = Object.keys(classifiedCities)
    .filter(key => key.startsWith(String(zipCode)))
    .map(key => classifiedCities[key].city);

  return cities.length ? cities : [null];
};
