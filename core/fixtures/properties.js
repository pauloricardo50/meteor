import PropertyService from 'core/api/properties/PropertyService';
import {
  PROPERTY_STATUS,
  USAGE_TYPE,
  PROPERTY_STYLE,
  VOLUME_NORM,
} from 'core/api/properties/propertyConstants';
import { fakeFile } from 'core/api/files/files';

const statuses = Object.values(PROPERTY_STATUS);
const usageTypes = Object.values(USAGE_TYPE);
const styles = Object.values(PROPERTY_STYLE);
const volumeNorms = Object.values(VOLUME_NORM);

export default (userId) => {
  const object = {
    status: statuses[Math.floor(Math.random() * statuses.length)],
    value: Math.floor(Math.random() * 100000000 + 1),
    address1: `Rue du Succès ${Math.floor(Math.random())}`,
    propertyWork: 40000,
    zipCode: Math.floor(Math.random() * 1000 + 1000),
    city: 'Lausanne',
    usageType: usageTypes[Math.floor(Math.random() * usageTypes.length)],
    style: styles[Math.floor(Math.random() * styles.length)],
    futureOwner: 0,
    constructionYear: 2010,
    landArea: 300,
    insideArea: 140,
    volume: 1500,
    volumeNorm: volumeNorms[Math.floor(Math.random() * volumeNorms.length)],
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
    files: {
      plans: [fakeFile],
      cubage: [fakeFile],
      pictures: [fakeFile],
      landRegisterExtract: [fakeFile],
    },
  };
  return PropertyService.insert({ object, userId: userId });
};
