import { Method } from '../methods/methods';

export const lotInsert = new Method({
  name: 'lotInsert',
  params: {
    promotionId: String,
    lot: Object,
  },
});

export const lotUpdate = new Method({
  name: 'lotUpdate',
  params: {
    lotId: String,
    object: Object,
  },
});

export const lotRemove = new Method({
  name: 'lotRemove',
  params: {
    lotId: String,
  },
});
