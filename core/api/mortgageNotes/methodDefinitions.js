import { Method } from '../methods/methods';

export const mortgageNoteInsert = new Method({
  name: 'mortgageNoteInsert',
  params: {
    mortgageNote: Object,
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
