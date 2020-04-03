import { mapProps } from 'recompose';

import { formatFilter } from 'core/api/lenderRules/helpers';
import { lenderRulesInsert } from 'core/api/lenderRules/methodDefinitions';

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
