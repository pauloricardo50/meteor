import { mapProps } from 'recompose';
import { addStructure } from 'core/api';

const FinancingStructuresHeaderAdderContainer = mapProps(({ loanId }) => ({
  handleAdd: () => addStructure.run({ loanId }),
}));

export default FinancingStructuresHeaderAdderContainer;
