import React from 'react';
import { compose, withProps, withStateHandlers } from 'recompose';

import { INTEREST_RATES } from '../../api/interestRates/interestRatesConstants';
import T from '../Translation';

const TranchePickerContainer = compose(
  withStateHandlers(
    ({ initialTranches = [] }) => ({ tranches: initialTranches }),
    {
      addTranche: ({ tranches }) => () => ({
        tranches: [...tranches, { value: 0, type: '' }],
      }),
      removeTranche: ({ tranches }) => typeToRemove => ({
        tranches: tranches.filter(({ type }) => type !== typeToRemove),
      }),
      setValue: ({ tranches }) => (type, value) => ({
        tranches: tranches.reduce(
          (acc, tranche) =>
            tranche.type === type
              ? [...acc, { ...tranche, value }]
              : [...acc, tranche],
          [],
        ),
      }),
      setType: ({ tranches }) => (oldType, newType) => ({
        tranches: tranches.reduce(
          (acc, tranche) =>
            tranche.type === oldType
              ? [...acc, { ...tranche, type: newType }]
              : [...acc, tranche],
          [],
        ),
      }),
    },
  ),
  withProps(({ types = Object.values(INTEREST_RATES) }) => ({
    options: types.map(type => ({
      id: type,
      label: <T id={`InterestsTable.${type}`} />,
    })),
  })),
);

export default TranchePickerContainer;
