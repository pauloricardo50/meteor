import { STEPS } from './loanConstants';
import { RESIDENCE_TYPE } from '../properties/propertyConstants';

export const emptyLoan = {
  step: STEPS.SOLVENCY,
  documents: {},
  contacts: [],
};

export const loanStep1 = {
  residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE,
  purchaseType: 'ACQUISITION',
  step: STEPS.SOLVENCY,
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
  step: STEPS.OFFERS,
  displayWelcomeScreen: false,
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
