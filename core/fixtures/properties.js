import PropertyService from 'core/api/properties/PropertyService';
import {
  PROPERTY_STATUS,
  USAGE_TYPE,
  PROPERTY_STYLE,
  VOLUME_NORM,
} from 'core/api/properties/propertyConstants';
import { fakeDocument } from 'core/api/files/fileHelpers';

const statuses = Object.values(PROPERTY_STATUS);
const usageTypes = Object.values(USAGE_TYPE);
const styles = Object.values(PROPERTY_STYLE);
const volumeNorms = Object.values(VOLUME_NORM);

const getRandomValueInRange = (min, max) => Math.random() * (max - min) + min;
const getRandomValueInArray = array =>
  array[Math.floor(Math.random() * array.length)];

const createFakeProperties = (userId) => {
  const object = {
    status: getRandomValueInArray(statuses),
    value: Math.round(getRandomValueInRange(500000, 3000000)),
    address1: `Rue du Succès ${Math.floor(getRandomValueInRange(1, 500))}`,
    propertyWork: 40000,
    zipCode: Math.round(getRandomValueInRange(1000, 4000)),
    city: 'Lausanne',
    usageType: getRandomValueInArray(usageTypes),
    style: getRandomValueInArray(styles),
    futureOwner: 0,
    constructionYear: 2010,
    landArea: 300,
    insideArea: 140,
    volume: 1500,
    volumeNorm: getRandomValueInArray(volumeNorms),
    roomCount: 5,
    bathroomCount: 2,
    toiletCount: 0,
    parking: {
      box: 0,
      inside: 1,
      outside: 2,
    },
    minergie: true,
    isCoproperty: true,
    copropertyPercentage: 400,
    cityPlacementQuality: 2,
    buildingPlacementQuality: 3,
    buildingQuality: 1,
    flatQuality: 2,
    materialsQuality: 2,
    adminValidation: {
      buildingPlacementQuality: 'No option selected',
      propertyInfo: 'Not completed',
    },
    documents: {
      plans: fakeDocument,
      cubage: fakeDocument,
      pictures: fakeDocument,
      landRegisterExtract: fakeDocument,
    },
  };

  return PropertyService.insert({ property: object, userId });
};

export default createFakeProperties;
