import { Match } from 'meteor/check';
import { Method } from '../methods/methods';

export const borrowerInsert = new Method({
  name: 'borrowerInsert',
  params: {
    object: Object,
    userId: Match.Optional(String),
  },
});

export const borrowerUpdate = new Method({
  name: 'borrowerUpdate',
  params: {
    borrowerId: String,
    object: Object,
  },
});

export const borrowerDelete = new Method({
  name: 'borrowerDelete',
  params: {
    borrowerId: String,
  },
});
