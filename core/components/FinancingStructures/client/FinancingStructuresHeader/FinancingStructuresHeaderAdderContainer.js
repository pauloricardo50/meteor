import { withProps, compose, withState } from 'recompose';
import { addNewStructure } from 'core/api';

const FinancingStructuresHeaderAdderContainer = compose(
  withState('isAdding', 'setIsAdding', false),
  withProps(({ loanId, setIsAdding }) => ({
    handleAdd: () => {
      setIsAdding(true);
      return addNewStructure.run({ loanId }).finally(() => setIsAdding(false));
    },
  })),
);

export default FinancingStructuresHeaderAdderContainer;
