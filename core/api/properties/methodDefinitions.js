import { Match } from 'meteor/check';
import { Method } from '../methods/methods';

export const propertyInsert = new Method({
  name: 'propertyInsert',
  params: {
    object: Object,
    userId: Match.Optional(String),
  },
});

export const propertyUpdate = new Method({
  name: 'propertyUpdate',
  params: {
    propertyId: String,
    object: Object,
  },
});

export const propertyDelete = new Method({
  name: 'propertyDelete',
  params: {
    propertyId: String,
  },
});
