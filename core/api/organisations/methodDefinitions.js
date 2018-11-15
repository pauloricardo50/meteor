import { Match } from 'meteor/check';
import { Method } from '../methods/methods';

export const organisationInsert = new Method({
  name: 'organisationInsert',
  params: {
    organisation: Object,
  },
});

export const organisationUpdate = new Method({
  name: 'organisationUpdate',
  params: {
    organisationId: String,
    object: Object,
  },
});

export const organisationRemove = new Method({
  name: 'organisationRemove',
  params: {
    organisationId: Object,
  },
});
