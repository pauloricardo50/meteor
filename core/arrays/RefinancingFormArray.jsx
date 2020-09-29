import React from 'react';
import moment from 'moment';

import T from '../components/Translation';

const getRefinancingFormArray = () => [
  {
    id: 'previousLender',
    type: 'textInput',
  },
  {
    id: 'previousLoanAmortization',
    type: 'textInput',
    money: true,
  },
  {
    id: 'previousLoanTranches',
    type: 'arrayInput',
    inputs: [
      { id: 'value', type: 'textInput', money: true },
      { id: 'dueDate', type: 'dateInput' },
      {
        id: 'remainingMonths',
        type: 'custom',
        Component: ({ InputProps: { label, itemValue } }) => {
          if (!itemValue?.dueDate) {
            return null;
          }

          const diff = moment(itemValue.dueDate).diff(new Date(), 'months');

          if (diff <= 0) {
            return null;
          }

          return (
            <div className="mb-16">
              {label}
              &nbsp;
              <b>
                {diff} <T defaultMessage="mois" />
              </b>
            </div>
          );
        },
      },
      {
        id: 'rate',
        type: 'percent',
        decimalPercent: true,
      },
      {
        id: 'duration',
        type: 'textInput',
        number: true,
      },
    ],
  },
];

export default getRefinancingFormArray;
