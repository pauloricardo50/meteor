import { withProps } from 'recompose';
import { updateStructure } from 'core/api';

const FinancingStructuresSingleHeaderContainer = withProps(({ loanId, structure }) => ({
  handleEditTitle: name =>
    updateStructure.run({
      loanId,
      structureId: structure.id,
      structure: { ...structure, name },
    }),
  handleEditDescription: description =>
    updateStructure.run({
      loanId,
      structureId: structure.id,
      structure: { ...structure, description },
    }),
}));

export default FinancingStructuresSingleHeaderContainer;
