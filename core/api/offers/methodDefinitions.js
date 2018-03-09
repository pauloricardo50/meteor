import { Match } from 'meteor/check';
import { Method } from '../methods/methods';

export const offerInsert = new Method({
  name: 'offerInsert',
  params: {
    object: Object,
    userId: Match.Optional(String),
    loanId: String,
  },
});

export const offerUpdate = {
  name: 'offerUpdate',
  params: {
    offerId: String,
    object: Object,
  },
};

export const offerDelete = {
  name: 'offerDelete',
  params: {
    offerId: String,
  },
};
