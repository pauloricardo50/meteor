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
        type: 'textInput',
        number: true,
      },
      { id: 'value', type: 'textInput', money: true },
      { id: 'dueDate', type: 'dateInput' },
      { id: 'rate', type: 'textInput', percent: true },
    ],
  },
];

export default getRefinancingFormArray;
