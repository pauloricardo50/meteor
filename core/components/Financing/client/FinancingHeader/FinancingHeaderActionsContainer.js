import { Meteor } from 'meteor/meteor';

import { withProps } from 'recompose';

import {
  duplicateStructure,
  removeStructure,
  selectStructure,
  updateStructure,
} from '../../../../api';

const FinancingHeaderActionsContainer = withProps(({ loanId, structureId, structure: { disabled } }) => ({
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
      condition: !disabled,
    },
    {
      label: disabled ? '[ADMIN] Déverouiller' : '[ADMIN] Verouiller',
      onClick: () =>
        updateStructure.run({
          loanId,
          structureId,
          structure: { disabled: !disabled },
        }),
      dividerTop: true,
      condition: Meteor.microservice === 'admin',
    },
  ].filter(({ condition }) => condition !== false),
}));

export default FinancingHeaderActionsContainer;
