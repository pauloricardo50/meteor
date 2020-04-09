import {
  MORTGAGE_NOTE_CATEGORIES,
  MORTGAGE_NOTE_TYPES,
} from '../api/helpers/sharedSchemaConstants';
import { INTEREST_RATES } from '../api/interestRates/interestRatesConstants';

const getRefinancingFormArray = ({ loan }) => [
  {
    id: 'previousLender',
    type: 'textInput',
  },
  {
    id: 'previousLoanTranches',
    type: 'arrayInput',
    inputs: [
      {
        id: 'type',
        type: 'selectInput',
        options: Object.values(INTEREST_RATES),
        intlId: 'loanTranches',
      },
      { id: 'value', type: 'textInput', money: true },
      { id: 'dueDate', type: 'dateInput' },
      { id: 'rate', type: 'textInput', percent: true },
    ],
  },
  {
    id: 'mortgageNotes',
    type: 'arrayInput',
    inputs: [
      { id: 'value', type: 'textInput', money: true },
      { id: 'rank', type: 'textInput', number: true },
      {
        id: 'type',
        type: 'selectInput',
        options: Object.values(MORTGAGE_NOTE_TYPES),
      },
      {
        id: 'category',
        type: 'selectInput',
        options: Object.values(MORTGAGE_NOTE_CATEGORIES),
      },
    ],
  },
];

export default getRefinancingFormArray;
