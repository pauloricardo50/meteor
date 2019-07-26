import { mapProps } from 'recompose';

import { lenderRulesInsert } from 'core/api/methods';
import { formatFilter } from 'core/api/lenderRules/helpers';
import LenderRulesForm from './LenderRulesForm';

export default mapProps(({ organisationId }) => ({
  onSubmit: ({ rules, name }) =>
    lenderRulesInsert.run({
      organisationId,
      logicRules: rules.map(formatFilter),
      object: { name },
    }),
  buttonProps: {
    label: 'Ajouter filtre',
    raised: true,
    secondary: true,
    primary: false,
  },
  title: 'Ajouter filtre',
}))(LenderRulesForm);
