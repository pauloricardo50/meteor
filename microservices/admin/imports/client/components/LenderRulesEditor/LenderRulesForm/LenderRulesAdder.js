import { mapProps } from 'recompose';

import { lenderRulesInsert } from 'core/api/methods';
import LenderRulesForm from './LenderRulesForm';

export default mapProps(({ organisationId }) => ({
  onSubmit: ({ rules }) =>
    lenderRulesInsert.run({
      organisationId,
      logicRules: rules.map(({ variable, operator, value }) => ({
        [operator]: [{ var: variable }, value],
      })),
    }),
  buttonProps: {
    label: 'Ajouter filtre',
    raised: true,
    secondary: true,
    primary: false,
  },
}))(LenderRulesForm);
