import {
  RESIDENCE_TYPE,
  PROPERTY_TYPE,
  MINERGIE_CERTIFICATE,
  VOLUME_NORM,
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
  volumeNorm: VOLUME_NORM.ECA,
  roomCount: 5,
  numberOfFloors: 5,
  floorNumber: 3,
  parkingInside: 1,
  parkingOutside: 2,
  minergie: MINERGIE_CERTIFICATE.MINERGIE_ECO,
  isCoproperty: true,
  copropertyPercentage: 400,
  terraceArea: 20,
};
