import { Match } from 'meteor/check';

import { Method } from '../methods/methods';

export const lenderRulesInsert = new Method({
  name: 'lenderRulesInsert',
  params: {
    organisationId: String,
    logicRules: Array,
    object: Match.Maybe(Object),
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

export const lenderRulesUpdateFilter = new Method({
  name: 'lenderRulesUpdateFilter',
  params: {
    lenderRulesId: String,
    logicRules: Array,
    name: Match.Optional(String),
  },
});

export const setLenderRulesOrder = new Method({
  name: 'setLenderRulesOrder',
  params: {
    orders: Object,
  },
});
