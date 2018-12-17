import { Method } from '../methods/methods';

export const irs10yInsert = new Method({
  name: 'irs10yInsert',
  params: {
    irs10y: Object,
  },
});

export const irs10yRemove = new Method({
  name: 'irs10yRemove',
  params: {
    irs10yId: String,
  },
});

export const irs10yUpdate = new Method({
  name: 'irs10yUpdate',
  params: {
    irs10yId: String,
    object: Object,
  },
});
