import { Match } from 'meteor/check';
import { Method } from '../methods/methods';

export const propertyInsert = new Method({
  name: 'propertyInsert',
  params: {
    property: Object,
    userId: Match.Optional(String),
  },
});

export const propertyUpdate = new Method({
  name: 'propertyUpdate',
  params: {
    propertyId: String,
    property: Object,
  },
});

export const propertyDelete = new Method({
  name: 'propertyDelete',
  params: {
    propertyId: String,
  },
});
