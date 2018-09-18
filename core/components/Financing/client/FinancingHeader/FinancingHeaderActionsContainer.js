import { withProps } from 'recompose';
import {
  duplicateStructure,
  removeStructure,
  selectStructure,
} from '../../../../api';

const FinancingHeaderActionsContainer = withProps(({ loanId, structureId }) => ({
  options: [
    {
      label: 'Choisir',
      onClick: () => selectStructure.run({ loanId, structureId }),
    },
    {
      label: 'Dupliquer',
      onClick: () => duplicateStructure.run({ loanId, structureId }),
    },
    {
      label: 'Supprimer',
      onClick: () => removeStructure.run({ loanId, structureId }),
      dividerTop: true,
    },
  ],
}));

export default FinancingHeaderActionsContainer;
