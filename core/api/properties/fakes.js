import { fakeDocument } from 'core/api/files/fileHelpers';
import { EXPERTISE_STATUS } from './propertyConstants';

export const emptyProperty = {};

export const fakeProperty = {
  value: 1000000,
  propertyWork: 40000,
  address1: 'Rue du Succès 18',
  zipCode: 1000,
  city: 'Lausanne',
  usageType: 'PRIMARY',
  type: 'FLAT',
  futureOwner: 0,
  constructionYear: 2010,
  landArea: 300,
  insideArea: 140,
  volume: 1500,
  volumeNorm: 'SIA',
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
  expertise: {
    status: EXPERTISE_STATUS.NONE,
  },
  documents: {
    plans: fakeDocument,
    cubage: fakeDocument,
    pictures: fakeDocument,
    landRegisterExtract: fakeDocument,
  },
};
