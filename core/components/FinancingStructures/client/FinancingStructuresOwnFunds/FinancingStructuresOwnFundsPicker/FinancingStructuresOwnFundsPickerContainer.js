import { compose, withProps } from 'recompose';

const FinancingStructuresOwnFundsPickerContainer = compose(withProps({
  handleDelete: () => {},
  handleSubmit: () => {},
  handleUpdateBorrower: () => {},
}));

export default FinancingStructuresOwnFundsPickerContainer;
