import { withProps, compose, withState } from 'recompose';
import { addNewStructure, addNewMaxStructure } from 'core/api';

const FinancingHeaderAdderContainer = compose(
  withState('isAdding', 'setIsAdding', false),
  withState('openDialog', 'setDialogOpen', false),
  withProps(({ loan: { _id: loanId }, setIsAdding, setDialogOpen }) => ({
    handleAdd: () => {
      setIsAdding(true);
      return addNewStructure.run({ loanId }).finally(() => setIsAdding(false));
    },
    handleAddMaxStructure: ({ residenceType, canton }) =>
      addNewMaxStructure
        .run({ residenceType, canton, loanId })
        .then(() => setDialogOpen(true)),
  })),
);

export default FinancingHeaderAdderContainer;
