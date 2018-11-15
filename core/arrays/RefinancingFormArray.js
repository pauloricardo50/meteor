import { INTEREST_RATES } from '../api/constants';

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
      },
      { id: 'value', type: 'textInput', money: true },
      { id: 'dueDate', type: 'dateInput' },
    ],
  },
  {
    id: 'mortgageNotes',
    type: 'arrayInput',
    inputs: [{ id: 'value', type: 'textInput', money: true }],
  },
];

export default getRefinancingFormArray;
