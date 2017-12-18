import { fakeFile } from 'core/arrays/files';
import moment from 'moment';

export const fakeGeneral = {
  purchaseType: 'acquisition',
  fortuneUsed: 250000,
  insuranceFortuneUsed: 100000,
  wantedClosingDate: moment()
    .add(15, 'd')
    .toDate(),
};

export const fakeProperty = {
  value: 1000000,
  propertyWork: 40000,
  address1: 'Rue du Succès 18',
  zipCode: 1201,
  city: 'Genève',
  usageType: 'primary',
  type: 'flat',
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
};

export const logic1 = {};

export const logic2 = {
  step: 2,
  verification: {
    requested: false,
    validated: true,
    comments: [],
  },
  auction: {},
};

export const logic3 = {
  step: 3,
  verification: {
    requested: false,
    validated: true,
    comments: [],
  },
  // auctionStarted: true,
  auction: {
    status: 'ended',
    startTime: new Date(),
    endTime: new Date(),
  },
  // auctionEndTime: new Date(),
  hasValidatedStructure: true,
  insuranceUsePreset: 'withdrawal',
  loanStrategyPreset: 'fixed',
  amortizationStrategyPreset: 'indirect',
  lender: {},
  closingSteps: [
    { id: 'upload0', title: 'Contrat de prêt signé', type: 'upload' },
    {
      id: 'todo0',
      title: 'Ouverture de compte chez votre prêteur',
      description:
        'Il faut ouvrir un compte bancaire chez votre prêteur où les fonds de votre hypothèque résideront.',
      type: 'todo',
      status: 'valid',
    },
    {
      id: 'todo1',
      title: 'Versement des fonds propres',
      description:
        'Vous devez aller chez le notaire et verser les fonds propres nécessaires sur un compte escrow.',
      type: 'todo',
      status: 'unverified',
    },
    {
      id: 'todo2',
      title: 'Engagement du notaire relative aux cédules hypothécaires',
      description: '',
      type: 'todo',
      status: 'error',
      error: 'Le notaire doit vous convier à un 2ème rendez-vous',
    },
  ],
};

export const fakeFiles = {
  plans: [fakeFile],
  cubage: [fakeFile],
  pictures: [fakeFile],
  buyersContract: [fakeFile],
  landRegisterExtract: [fakeFile],
  coownershipAllocationAgreement: [fakeFile],
  coownershipAgreement: [fakeFile],
  upload0: [fakeFile],
};

export const fakeFiles2 = {
  plans: [fakeFile],
  cubage: [fakeFile],
  pictures: [fakeFile],
  // buyersContract: [fakeFile],
  // landRegisterExtract: [fakeFile],
  // marketingBrochure: [fakeFile],
  // coownershipAllocationAgreement: [fakeFile],
  // coownershipAgreement: [fakeFile],
};

export const requestStep1 = {
  name: 'Rue du Test 42',
  general: fakeGeneral,
  property: fakeProperty,
  logic: logic1,
  files: fakeFiles,
};

export const requestStep2 = {
  name: 'Rue du Test 42',
  general: fakeGeneral,
  property: fakeProperty,
  logic: logic2,
  files: fakeFiles,
};

export const requestStep3 = completeFiles => ({
  name: 'Rue du Test 42',
  general: {
    ...fakeGeneral,
    loanTranches: [
      {
        value: 750000,
        type: 'interest10',
        // TODO add tranches here
      },
    ],
  },
  property: fakeProperty,
  logic: logic3,
  files: completeFiles ? fakeFiles : fakeFiles2,
});
