import { fakeDocument } from 'core/api/files/fakes';
import { EXPERTISE_STATUS } from './propertyConstants';
import {
  RESIDENCE_TYPE,
  PROPERTY_TYPE,
  MINERGIE_CERTIFICATE,
} from './propertyConstants';

export const emptyProperty = {};

export const fakeProperty = {
  value: 1000000,
  propertyWork: 40000,
  address1: 'Rue du Succès 18',
  zipCode: 1000,
  city: 'Lausanne',
  residenceType: RESIDENCE_TYPE.MAIN,
  type: PROPERTY_TYPE.FLAT,
  futureOwner: 0,
  constructionYear: 2010,
  landArea: 300,
  insideArea: 140,
  volume: 1500,
  volumeNorm: 'SIA_416',
  roomCount: 5,
  numberOfFloors: 5,
  floorNumber: 3,
  parking: {
    inside: 1,
    outside: 2,
  },
  minergie: MINERGIE_CERTIFICATE.ECO,
  isCoproperty: true,
  copropertyPercentage: 400,
  valuation: {
    status: EXPERTISE_STATUS.NONE,
  },
  documents: {
    plans: fakeDocument,
    cubage: fakeDocument,
    pictures: fakeDocument,
    landRegisterExtract: fakeDocument,
  },
};
