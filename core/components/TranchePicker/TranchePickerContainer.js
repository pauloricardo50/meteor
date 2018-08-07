import { withStateHandlers, compose, withProps } from 'recompose';

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
            (tranche.type === type
              ? [...acc, { ...tranche, value }]
              : [...acc, tranche]),
          [],
        ),
      }),
      setType: ({ tranches }) => (oldType, newType) => ({
        tranches: tranches.reduce(
          (acc, tranche) =>
            (tranche.type === oldType
              ? [...acc, { ...tranche, type: newType }]
              : [...acc, tranche]),
          [],
        ),
      }),
    },
  ),
  withProps(({ types }) => ({
    options: types.map(type => ({ id: type, label: `TranchePicker.${type}` })),
  })),
);

export default TranchePickerContainer;
