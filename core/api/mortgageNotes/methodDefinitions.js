import { Match } from 'meteor/check';

import { Method } from '../methods/methods';

export const mortgageNoteInsert = new Method({
  name: 'mortgageNoteInsert',
  params: {
    mortgageNote: Match.Optional(Object),
    propertyId: Match.Optional(String),
    borrowerId: Match.Optional(String),
  },
});

export const mortgageNoteRemove = new Method({
  name: 'mortgageNoteRemove',
  params: {
    mortgageNoteId: String,
  },
});

export const mortgageNoteUpdate = new Method({
  name: 'mortgageNoteUpdate',
  params: {
    mortgageNoteId: String,
    object: Object,
  },
});
