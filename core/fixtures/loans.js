import moment from 'moment';
import LoanService from 'core/api/loans/LoanService';
import { PURCHASE_TYPE } from 'core/api/loans/loanConstants';
import {
  fakeDocument,
  fakeDocumentWithLabel,
} from 'core/api/files/fileHelpers';
import { createFakeBorrowers } from './borrowers';
import { createFakeProperty } from './properties';
import { Loans } from '../api';

const purchaseTypes = Object.values(PURCHASE_TYPE);

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
    verifiedAt: new Date(),
    comments: [],
  },
  auction: {},
};

const logic3 = {
  step: 3,
  verification: {
    requested: false,
    validated: false,
    requestedAt: new Date(),
    verifiedAt: new Date(),
    comments: [],
  },
  auction: {
    status: 'ENDED',
    startTime: new Date(),
    endTime: new Date(),
  },
  hasValidatedStructure: true,
  insuranceUsePreset: 'COLLATERAL',
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
  buyersContract: fakeDocumentWithLabel,
  coownershipAllocationAgreement: fakeDocument,
  coownershipAgreement: fakeDocument,
};

const fakeFiles2 = {};

export const createFakeLoan = (
  userId,
  step,
  completeFiles = Math.random() > 0.5,
) => {
  const borrowerIds = createFakeBorrowers(userId);
  const propertyId = createFakeProperty(userId);
  const loan = {
    name: `Rue du Test ${Math.floor(Math.random() * 1000)}`,
    borrowerIds,
    propertyId,
    general: fakeGeneral,
    documents: fakeFiles,
    contacts: [],
  };

  switch (step) {
  case 3:
    loan.logic = logic3;
    loan.adminValidation = {
      bonus_bonus2017: 'Does not match with taxes location',
      bankFortune: 'Not enough',
    };
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

export const getRelatedLoansIds = usersIds =>
  Loans.find({ userId: { $in: usersIds } }, { fields: { _id: 1 } })
    .fetch()
    .map(item => item._id);
