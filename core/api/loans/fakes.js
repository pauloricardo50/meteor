import { RESIDENCE_TYPE, STEPS } from '../constants';

export const emptyLoan = {
  step: STEPS.PREPARATION,
  documents: {},
  contacts: [],
};

export const loanStep1 = {
  residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE,
  purchaseType: 'ACQUISITION',
  step: STEPS.PREPARATION,
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
  step: STEPS.FIND_LENDER,
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
