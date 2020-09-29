import { Meteor } from 'meteor/meteor';

import React from 'react';
import { withProps } from 'recompose';

import {
  duplicateStructure,
  removeStructure,
  selectStructure,
  updateStructure,
} from '../../../../api/loans/methodDefinitions';
import T from '../../../Translation';

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
        disabled: disabled || selected,
        secondary: disabled ? (
          <div style={{ maxWidth: 200, whiteSpace: 'normal' }}>
            <T defaultMessage="Vous ne pouvez pas supprimer un plan financier verrouillé" />
          </div>
        ) : selected ? (
          <div style={{ maxWidth: 200, whiteSpace: 'normal' }}>
            <T defaultMessage="Vous ne pouvez pas supprimer le plan financier choisi" />
          </div>
        ) : null,
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
