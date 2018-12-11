import { Method } from '../methods/methods';

export const partnerInsert = new Method({
  name: 'partnerInsert',
  params: {
    partner: Object,
  },
});

export const partnerRemove = new Method({
  name: 'partnerRemove',
  params: {
    partnerId: String,
  },
});

export const partnerUpdate = new Method({
  name: 'partnerUpdate',
  params: {
    partnerId: String,
    object: Object,
  },
});
