import { withProps } from 'recompose';

import {
  lenderRulesInsert,
  addLenderRulesFilter,
  lenderRulesUpdate,
} from 'core/api/methods';

export default withProps(({ organisationId, lenderRules = {} }) => {
  const { _id: lenderRulesId } = lenderRules;
  return {
    addLenderRules: () => lenderRulesInsert.run({ organisationId }),
    addFilter: filter => addLenderRulesFilter.run({ organisationId, filter }),
    updateMath: values =>
      lenderRulesUpdate.run({ lenderRulesId, object: values }),
    updateFilter: () => {},
  };
});
