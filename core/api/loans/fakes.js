import { RESIDENCE_TYPE, STEPS } from '../constants';

export const logic1 = {
  step: STEPS.PREPARATION,
};

export const logic2 = {
  step: STEPS.FIND_LENDER,
};
export const logic3 = {
  step: STEPS.GET_CONTRACT,
};

export const emptyLoan = {
  logic: logic1,
  documents: {},
  contacts: [],
};

export const loanStep1 = {
  residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE,
  purchaseType: 'ACQUISITION',
  logic: logic1,
  structures: [
    {
      id: 'randomStructureId',
      wantedLoan: 800000,
    },
  ],
  selectedStructure: 'randomStructureId',
};

export const loanStep2 = {
  residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE,
  purchaseType: 'ACQUISITION',
  logic: logic2,
  structures: [
    {
      id: 'randomStructureId',
      wantedLoan: 800000,
    },
  ],
  selectedStructure: 'randomStructureId',
  contacts: [
    {
      name: 'Jean Dupont',
      phoneNumber: '+41 22 566 01 10',
      title: 'Courtier immobilier',
      email: 'digital@e-potek.ch',
    },
  ],
};
