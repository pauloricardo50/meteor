import faker from 'faker';
import PropertyService from '../api/properties/PropertyService';
import {
  PROPERTY_STATUS,
  RESIDENCE_TYPE,
  PROPERTY_TYPE,
  VOLUME_NORM,
  MINERGIE_CERTIFICATE,
  QUALITY,
} from '../api/properties/propertyConstants';
import { Properties } from '../api';

const statuses = Object.values(PROPERTY_STATUS);
const residenceTypes = Object.values(RESIDENCE_TYPE);
const types = Object.values(PROPERTY_TYPE);
const volumeNorms = Object.values(VOLUME_NORM);
const minergies = Object.values(MINERGIE_CERTIFICATE);
const conditions = Object.values(QUALITY.CONDITION);
const standards = Object.values(QUALITY.STANDARD);

const getRandomValueInRange = (min, max) => Math.random() * (max - min) + min;
const getRandomValueInArray = array =>
  array[Math.floor(Math.random() * array.length)];

export const createFakeProperty = (userId) => {
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
    parking: {
      inside: 1,
      outside: 2,
    },
    qualityProfile: {
      condition: getRandomValueInArray(conditions),
      standard: getRandomValueInArray(standards),
    },
    minergie: getRandomValueInArray(minergies),
    isCoproperty: true,
    copropertyPercentage: 400,
    adminValidation: {
      buildingPlacementQuality: 'No option selected',
      propertyInfo: 'Not completed',
    },
  };

  return { ...property, _id: PropertyService.insert({ property, userId }) };
};

export const getRelatedPropertyIds = usersIds =>
  Properties.find({ userId: { $in: usersIds } }, { fields: { _id: 1 } })
    .fetch()
    .map(item => item._id);
