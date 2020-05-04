import { withProps } from 'recompose';

import {
  lenderRulesInitialize,
  lenderRulesInsert,
  lenderRulesUpdate,
} from 'core/api/lenderRules/methodDefinitions';

export default withProps(({ organisationId }) => ({
  initializeLenderRules: () => lenderRulesInitialize.run({ organisationId }),
  addLenderRules: () => lenderRulesInsert.run({ organisationId }),
  makeUpdateLenderRules: lenderRulesId => values =>
    lenderRulesUpdate.run({ lenderRulesId, object: values }),
}));
