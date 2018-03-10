import { Match } from 'meteor/check';
import { Method } from '../methods/methods';

export const offerInsert = new Method({
  name: 'offerInsert',
  params: {
    offer: Object,
    userId: Match.Optional(String),
    loanId: String,
  },
});

export const offerUpdate = new Method({
  name: 'offerUpdate',
  params: {
    offerId: String,
    offer: Object,
  },
});

export const offerDelete = new Method({
  name: 'offerDelete',
  params: {
    offerId: String,
  },
});
