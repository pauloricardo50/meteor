import { withProps } from 'recompose';

import { lenderRulesInsert } from 'core/api/methods';
import LenderRulesForm from './LenderRulesForm';

export default withProps(({ organisationId }) => ({
  onSubmit: values => lenderRulesInsert.run({
    organisationId,
    logicRules: values.rules.map(({ variable, operator, value }) => ({
      [operator]: [{ var: variable }, value],
    })),
  }),
}))(LenderRulesForm);
