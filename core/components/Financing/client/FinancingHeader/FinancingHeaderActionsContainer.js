import { Meteor } from 'meteor/meteor';

import { withProps } from 'recompose';

import {
  duplicateStructure,
  removeStructure,
  selectStructure,
  updateStructure,
} from '../../../../api/loans/methodDefinitions';

export default withProps(
  ({ loanId, structureId, structure: { disabled }, selected }) => ({
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
        disabled: selected,
      },
      {
        label: disabled ? '[ADMIN] Déverrouiller' : '[ADMIN] Verrouiller',
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
  }),
);
