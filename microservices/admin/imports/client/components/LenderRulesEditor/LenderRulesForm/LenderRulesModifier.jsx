import React from 'react';
import { branch, compose, mapProps, renderNothing } from 'recompose';

import {
  formatFilter,
  isAllRule,
  parseFilter,
} from 'core/api/lenderRules/helpers';
import {
  lenderRulesRemove,
  lenderRulesUpdateFilter,
} from 'core/api/lenderRules/methodDefinitions';
import Button from 'core/components/Button';

import LenderRulesForm from './LenderRulesForm';

export default compose(
  branch(({ filter }) => isAllRule({ filter }), renderNothing),
  mapProps(({ lenderRulesId, filter, name }) => ({
    onSubmit: ({ rules, name: newName }) =>
      lenderRulesUpdateFilter.run({
        lenderRulesId,
        logicRules: rules.map(formatFilter),
        name: newName,
      }),
    model: { rules: filter.and.map(parseFilter), name },
    buttonProps: { label: 'Modifier' },
    renderAdditionalActions: ({ closeDialog, setDisableActions, disabled }) => (
      <Button
        onClick={() => {
          setDisableActions(true);
          return lenderRulesRemove
            .run({ lenderRulesId })
            .then(closeDialog)
            .finally(() => setDisableActions(false));
        }}
        error
        disabled={disabled}
      >
        Supprimer
      </Button>
    ),
  })),
)(LenderRulesForm);
