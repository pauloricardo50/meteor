import { Match } from 'meteor/check';
import { Method } from '../methods/methods';

export const offerInsert = new Method({
  name: 'offerInsert',
  params: {
    offer: Object,
  },
});

export const offerUpdate = new Method({
  name: 'offerUpdate',
  params: {
    offerId: String,
    object: Object,
  },
});

export const offerDelete = new Method({
  name: 'offerDelete',
  params: {
    offerId: String,
  },
});
