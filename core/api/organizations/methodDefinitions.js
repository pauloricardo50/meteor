import { Match } from 'meteor/check';
import { Method } from '../methods/methods';

export const organizationInsert = new Method({
  name: 'organizationInsert',
  params: {
    organization: Object,
  },
});

export const organizationUpdate = new Method({
  name: 'organizationUpdate',
  params: {
    organizationId: String,
    object: Object,
  },
});

export const organizationRemove = new Method({
  name: 'organizationRemove',
  params: {
    organizationId: Object,
  },
});
