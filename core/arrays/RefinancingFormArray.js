import { INTEREST_RATES } from '../api/interestRates/interestRatesConstants';

const getRefinancingFormArray = () => [
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
];

export default getRefinancingFormArray;
