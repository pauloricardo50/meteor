import { withProps } from 'recompose';
import { addNewStructure } from 'core/api';

const FinancingStructuresHeaderAdderContainer = withProps(({ loanId }) => ({
  handleAdd: () => addStruaddNewStructurecture.run({ loanId }),
}));

export default FinancingStructuresHeaderAdderContainer;
