import {
  RESIDENCE_TYPE,
  PROPERTY_TYPE,
  MINERGIE_CERTIFICATE,
  FLAT_TYPE,
  VOLUME_NORM,
  STEPS,
} from '../constants';

export const fakeGeneral = {
  purchaseType: 'ACQUISITION',
};

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
  auction: {},
};

export const logic3 = {
  step: STEPS.FIND_LENDER,
  verification: {
    requested: false,
    validated: true,
    comments: [],
  },
  auction: {
    status: 'ENDED',
    startTime: new Date(),
    endTime: new Date(),
  },
  closingSteps: [
    { id: 'upload0', title: 'Contrat de prêt signé', type: 'UPLOAD' },
    {
      id: 'todo0',
      title: 'Ouverture de compte chez votre prêteur',
      description:
        'Il faut ouvrir un compte bancaire chez votre prêteur où les fonds de votre hypothèque résideront.',
      type: 'TODO',
      status: 'VALID',
    },
    {
      id: 'todo1',
      title: 'Versement des fonds propres',
      description:
        'Vous devez aller chez le notaire et verser les fonds propres nécessaires sur un compte escrow.',
      type: 'TODO',
      status: 'UNVERIFIED',
    },
    {
      id: 'todo2',
      title: 'Engagement du notaire relative aux cédules hypothécaires',
      description: '',
      type: 'TODO',
      status: 'ERROR',
      error: 'Le notaire doit vous convier à un 2ème rendez-vous',
    },
  ],
};

export const fakeFiles2 = {};

export const emptyLoan = {
  general: {},
  logic: logic1,
  documents: {},
  contacts: [],
};

export const loanStep1 = {
  general: fakeGeneral,
  logic: logic1,
  contacts: [],
};

export const loanStep2 = {
  general: fakeGeneral,
  logic: logic2,
  contacts: [],
};

export const loanStep3 = () => ({
  general: fakeGeneral,
  logic: logic3,
  contacts: [],
});
