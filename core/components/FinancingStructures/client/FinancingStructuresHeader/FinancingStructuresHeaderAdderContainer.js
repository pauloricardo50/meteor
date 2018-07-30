import { withProps } from 'recompose';
import { addStructure } from 'core/api';

const FinancingStructuresHeaderAdderContainer = withProps(({ loanId }) => ({
  handleAdd: () => addStructure.run({ loanId }),
}));

export default FinancingStructuresHeaderAdderContainer;
