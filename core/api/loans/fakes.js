import {
  RESIDENCE_TYPE,
  PROPERTY_TYPE,
  MINERGIE_CERTIFICATE,
  FLAT_TYPE,
  VOLUME_NORM,
  STEPS,
} from '../constants';

export const fakeProperty = {
  value: 1000000,
  address1: 'Rue du Succès 18',
  zipCode: 1000,
  city: 'Lausanne',
  residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE,
  propertyType: PROPERTY_TYPE.FLAT,
  flatType: FLAT_TYPE.SINGLEFLOOR,
  numberOfFloors: 5,
  floorNumber: 2,
  futureOwner: 0,
  constructionYear: 2010,
  landArea: 300,
  insideArea: 140,
  volume: 1500,
  volumeNorm: VOLUME_NORM.SIA_416,
  roomCount: 5,
  parkingInside: 1,
  parkingOutside: 2,
  minergie: MINERGIE_CERTIFICATE.MINERGIE_ECO,
  isCoproperty: true,
  copropertyPercentage: 400,
};

export const logic1 = {
  step: STEPS.PREPARATION,
};

export const logic2 = {
  step: STEPS.GET_CONTRACT,
  verification: {
    requested: false,
    validated: true,
    comments: [],
  },
};

export const logic3 = {
  step: STEPS.FIND_LENDER,
  verification: {
    requested: false,
    validated: true,
    comments: [],
  },
};

export const fakeFiles2 = {};

export const emptyLoan = {
  logic: logic1,
  documents: {},
  contacts: [],
};

export const loanStep1 = {
  purchaseType: 'ACQUISITION',
  logic: logic1,
  structures: [
    {
      id: 'randomStructureId',
      wantedLoan: 800000,
    },
  ],
  selectedStructure: 'randomStructureId',
  contacts: [],
};
