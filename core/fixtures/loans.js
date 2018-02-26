import moment from 'moment';
import LoanService from 'core/api/loans/LoanService';
import {
  LOAN_STATUS,
  PURCHASE_TYPE,
  CANTONS,
  INTEREST_RATES,
  OWNER,
  AUCTION_STATUS,
  CLOSING_STEPS_TYPE,
  CLOSING_STEPS_STATUS,
  AUCTION_MOST_IMPORTANT,
  INSURANCE_USE_PRESET,
  LOAN_STRATEGY_PRESET,
  AMORTIZATION_STRATEGY_PRESET,
  PAYMENT_SCHEDULES,
} from 'core/api/loans/loanConstants';
import { fakeFile } from 'core/api/files/files';
import { STEPS_PER_LOAN } from './config';
import createBorrowers from './borrowers';
import createProperty from './properties';

const purchaseTypes = Object.values(PURCHASE_TYPE);

const generateLoanStep = maxSteps => Math.floor(Math.random() * maxSteps + 1);

const fakeGeneral = {
  purchaseType: purchaseTypes[Math.floor(Math.random() * purchaseTypes.length)],
  fortuneUsed: 250000,
  insuranceFortuneUsed: 100000,
  wantedClosingDate: moment()
    .add(15, 'd')
    .toDate(),
};

const logic1 = {};

const logic2 = {
  step: 2,
  verification: {
    requested: false,
    validated: true,
    comments: [],
  },
  auction: {},
};

const logic3 = {
  step: 3,
  verification: {
    requested: false,
    validated: true,
    comments: [],
  },
  // auctionStarted: true,
  auction: {
    status: 'ENDED',
    startTime: new Date(),
    endTime: new Date(),
  },
  // auctionEndTime: new Date(),
  hasValidatedStructure: true,
  insuranceUsePreset: 'WITHDRAWAL',
  loanStrategyPreset: 'FIXED',
  amortizationStrategyPreset: 'INDIRECT',
  lender: {},
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

const fakeFiles = {
  plans: [fakeFile],
  cubage: [fakeFile],
  pictures: [fakeFile],
  buyersContract: [fakeFile],
  landRegisterExtract: [fakeFile],
  coownershipAllocationAgreement: [fakeFile],
  coownershipAgreement: [fakeFile],
  upload0: [fakeFile],
};

const fakeFiles2 = {
  plans: [fakeFile],
  cubage: [fakeFile],
  pictures: [fakeFile],
  // buyersContract: [fakeFile],
  // landRegisterExtract: [fakeFile],
  // marketingBrochure: [fakeFile],
  // coownershipAllocationAgreement: [fakeFile],
  // coownershipAgreement: [fakeFile],
};

export default (userId) => {
  const completeFiles = Math.random() > 0.5;
  const borrowerIds = createBorrowers(userId);
  const propertyId = createProperty(userId);
  const loan = {
    name: `Rue du Test ${Math.floor(Math.random())}`,
    borrowerIds,
    propertyId,
    general: fakeGeneral,
    files: fakeFiles,
  };

  switch (generateLoanStep(STEPS_PER_LOAN)) {
  case 3:
    loan.logic = logic3;
    loan.files = completeFiles ? fakeFiles : fakeFiles2;
    loan.loanTranches = [
      {
        value: 750000,
        type: 'interest10',
        // TODO add tranches here
      },
    ];
    break;
  case 2:
    loan.logic = logic2;
    break;
  default:
    loan.logic = logic1;
  }

  return LoanService.insert({ loan, userId });
};
