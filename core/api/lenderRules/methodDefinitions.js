import { Method } from '../methods/methods';

export const lenderRulesInsert = new Method({
  name: 'lenderRulesInsert',
  params: {
    organisationId: String,
  },
});

export const lenderRulesRemove = new Method({
  name: 'lenderRulesRemove',
  params: {
    lenderRulesId: String,
  },
});

export const lenderRulesUpdate = new Method({
  name: 'lenderRulesUpdate',
  params: {
    lenderRulesId: String,
    object: Object,
  },
});

export const addLenderRulesFilter = new Method({
  name: 'addLenderRulesFilter',
  params: {
    lenderRulesId: String,
    filter: Object,
  },
});

export const removeLenderRulesFilter = new Method({
  name: 'removeLenderRulesFilter',
  params: {
    lenderRulesId: String,
    filterId: String,
  },
});

export const updateLenderRulesFilter = new Method({
  name: 'updateLenderRulesFilter',
  params: {
    lenderRulesId: String,
    filterId: String,
    rules: Object,
  },
});
