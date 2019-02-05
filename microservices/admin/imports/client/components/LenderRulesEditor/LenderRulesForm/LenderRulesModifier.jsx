import React from 'react';
import { compose, branch, renderNothing, mapProps } from 'recompose';

import { lenderRulesRemove, lenderRulesUpdateFilter } from 'core/api/methods';
import {
  isAllRule,
  parseFilter,
  formatFilter,
} from 'core/api/lenderRules/helpers';
import Button from 'core/components/Button';
import LenderRulesForm from './LenderRulesForm';

export default compose(
  branch(({ filter }) => isAllRule({ filter }), renderNothing),
  mapProps(({ lenderRulesId, filter }) => ({
    onSubmit: ({ rules }) =>
      lenderRulesUpdateFilter.run({
        lenderRulesId,
        logicRules: rules.map(formatFilter),
      }),
    model: { rules: filter.and.map(parseFilter) },
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
