import { fakeDocument } from 'core/api/files/fakes';
import {
  RESIDENCE_TYPE,
  PROPERTY_TYPE,
  MINERGIE_CERTIFICATE,
  VOLUME_NORM,
  VALUATION_STATUS,
} from './propertyConstants';

export const emptyProperty = {};

export const fakeProperty = {
  value: 1000000,
  address1: 'Rue du Succès 18',
  zipCode: 1000,
  city: 'Lausanne',
  residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE,
  type: PROPERTY_TYPE.FLAT,
  futureOwner: 0,
  constructionYear: 2010,
  landArea: 300,
  insideArea: 140,
  volume: 1500,
  volumeNorm: VOLUME_NORM.SIA_416,
  roomCount: 5,
  numberOfFloors: 5,
  floorNumber: 3,
  parking: {
    inside: 1,
    outside: 2,
  },
  minergie: MINERGIE_CERTIFICATE.MINERGIE_ECO,
  isCoproperty: true,
  copropertyPercentage: 400,
  valuation: {
    status: VALUATION_STATUS.NONE,
  },
  documents: {
    plans: fakeDocument,
    cubage: fakeDocument,
    pictures: fakeDocument,
    landRegisterExtract: fakeDocument,
  },
};
