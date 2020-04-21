const fs = require('fs');
// const mainCitiesJSON = require('./mainCities');

const mainCities = JSON.parse(fs.readFileSync('./mainCities.json', 'utf-8'));
const citiesCoordinates = JSON.parse(
  fs.readFileSync('./citiesCoordinates.json', 'utf-8'),
);

const R = 6371e3;

const toRadians = degrees => {
  const pi = Math.PI;
  return degrees * (pi / 180);
};
const calculateDistance = ({ lat1, lon1, lat2, lon2 }) => {
  const phi1 = toRadians(lat1);
  const phi2 = toRadians(lat2);
  const deltaPhi = toRadians(lat2 - lat1);
  const deltaLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) *
      Math.cos(phi2) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

const getClosestMainCity = ({ city, cities }) => {
  const best = { dist: Infinity, mainCity: undefined };
  const { lat: cityLat, long: cityLong } = city;

  mainCities.forEach(({ zipCode: zip, skip }) => {
    const mainCity = cities.find(({ zipCode }) => zipCode === zip);
    const { lat: mainCityLat, long: mainCityLong } = mainCity;

    const distance = calculateDistance({
      lat1: cityLat,
      lon1: cityLong,
      lat2: mainCityLat,
      lon2: mainCityLong,
    });

    if (distance < best.dist) {
      best.dist = distance;
      best.mainCity = { ...mainCity, skip: !!skip };
    }
  });

  return best.mainCity;
};

const classifyCity = (city, index, cities) => {
  const isMainCity = mainCities.some(({ zipCode }) => zipCode === city.zipCode);
  let closestMainCity;

  if (isMainCity) {
    closestMainCity = cities.find(({ zipCode }) => zipCode === city.zipCode);
  } else {
    closestMainCity = getClosestMainCity({ city, cities });
  }

  return { ...city, closestMainCity };
};

const classifyCities = () => {
  const classifiedCities = JSON.stringify(citiesCoordinates.map(classifyCity));
  fs.writeFileSync(
    '../../core/api/gpsStats/server/classifiedCities.json',
    classifiedCities,
    'utf-8',
  );
};

classifyCities();
