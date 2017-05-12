import { fakeFile } from '/imports/js/arrays/files';

export const fakeGeneral = {
  purchaseType: 'acquisition',
  fortuneUsed: 250000,
  insuranceFortuneUsed: 100000,
  files: {},
};

export const fakeProperty = {
  value: 1000000,
  propertyWork: 40000,
  address1: 'Rue du Succès 18',
  zipCode: 1200,
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
  copropertyPercentage: 0.400,
  cityPlacementQuality: 2,
  buildingPlacementQuality: 3,
  buildingQuality: 1,
  flatQuality: 2,
  materialsQuality: 2,
  files: {},
};

export const logic1 = {};

export const logic2 = {
  step: 1,
  verification: {
    requested: false,
    validated: true,
    comments: [],
  },
};

export const logic3 = {
  step: 2,
  verification: {
    requested: false,
    validated: true,
    comments: [],
  },
  auctionStarted: true,
  auctionStartTime: new Date(),
  auctionEndTime: new Date(),
  hasValidatedStructure: true,
  insuranceUsePreset: 'withdrawal',
  loanStrategyPreset: 'fixed',
  amortizationStrategyPreset: 'indirect',
  lender: {},
};

export const requestStep1 = {
  name: 'Rue du Test 42',
  general: fakeGeneral,
  property: fakeProperty,
  logic: logic1,
};

export const requestStep2 = {
  name: 'Rue du Test 42',
  general: fakeGeneral,
  property: fakeProperty,
  logic: logic2,
};

export const requestStep3 = {
  name: 'Rue du Test 42',
  general: {
    ...fakeGeneral,
    loanTranches: [
      {
        value: 700000,
        type: '10y',
        // TODO add tranches here
      },
    ],
  },
  property: fakeProperty,
  logic: logic3,
};
