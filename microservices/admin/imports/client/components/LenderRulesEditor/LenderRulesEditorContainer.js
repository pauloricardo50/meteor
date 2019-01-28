import { withProps } from 'recompose';

import { lenderRulesInsert, addLenderRulesFilter } from 'core/api/methods';

export default withProps(({ organisationId }) => ({
  addLenderRules: () => lenderRulesInsert.run({ organisationId }),
  addFilter: filter => addLenderRulesFilter.run({ organisationId, filter }),
}));
