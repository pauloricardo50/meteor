const getRefinancingFormArray = () => [
  {
    id: 'previousLender',
    type: 'textInput',
  },
  {
    id: 'previousLoanTranches',
    type: 'arrayInput',
    inputs: [
      { id: 'value', type: 'textInput', money: true },
      { id: 'dueDate', type: 'dateInput' },
      { id: 'rate', type: 'textInput', percent: true },
      {
        id: 'duration',
        type: 'textInput',
        number: true,
      },
    ],
  },
];

export default getRefinancingFormArray;
