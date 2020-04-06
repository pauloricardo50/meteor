import faker from 'faker/locale/fr';

import {
  MINERGIE_CERTIFICATE,
  PROPERTY_STATUS,
  PROPERTY_TYPE,
  RESIDENCE_TYPE,
  VOLUME_NORM,
} from '../api/properties/propertyConstants';
import PropertyService from '../api/properties/server/PropertyService';

const statuses = Object.values(PROPERTY_STATUS);
const residenceTypes = Object.values(RESIDENCE_TYPE);
const types = Object.values(PROPERTY_TYPE);
const volumeNorms = Object.values(VOLUME_NORM);
const minergies = Object.values(MINERGIE_CERTIFICATE);

const getRandomValueInRange = (min, max) => Math.random() * (max - min) + min;
const getRandomValueInArray = array =>
  array[Math.floor(Math.random() * array.length)];

export const createFakeProperty = userId => {
  const property = {
    status: getRandomValueInArray(statuses),
    value: Math.round(getRandomValueInRange(500000, 3000000)),
    address1: faker.address.streetAddress(),
    zipCode: 1201,
    city: 'Genève',
    residenceType: getRandomValueInArray(residenceTypes),
    propertyType: getRandomValueInArray(types),
    futureOwner: 0,
    constructionYear: 2010,
    landArea: 300,
    insideArea: 140,
    volume: 1500,
    volumeNorm: getRandomValueInArray(volumeNorms),
    roomCount: 5,
    parkingInside: 1,
    parkingOutside: 2,
    minergie: getRandomValueInArray(minergies),
    isCoproperty: true,
    copropertyPercentage: 400,
  };

  return { ...property, _id: PropertyService.insert({ property, userId }) };
};

export const getRelatedPropertyIds = usersIds =>
  PropertyService.find({ userId: { $in: usersIds } }, { fields: { _id: 1 } })
    .fetch()
    .map(item => item._id);
