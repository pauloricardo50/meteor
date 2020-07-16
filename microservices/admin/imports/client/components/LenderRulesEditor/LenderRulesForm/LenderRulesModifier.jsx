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
    onDelete: () => lenderRulesRemove.run({ lenderRulesId }),
    title: 'Modifier le filtre',
  })),
)(LenderRulesForm);
