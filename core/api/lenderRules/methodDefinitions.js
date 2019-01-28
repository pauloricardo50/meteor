import { Method } from '../methods/methods';

export const lenderRulesInsert = new Method({
  name: 'lenderRulesInsert',
  params: {
    lenderRules: Object,
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
