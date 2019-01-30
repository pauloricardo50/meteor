import { Method } from '../methods/methods';

export const lenderRulesInsert = new Method({
  name: 'lenderRulesInsert',
  params: {
    organisationId: String,
  },
});
export const lenderRulesInitialize = new Method({
  name: 'lenderRulesInitialize',
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
