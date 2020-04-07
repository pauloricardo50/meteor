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
    organisationId: String,
  },
});

export const addContactToOrgnaisation = new Method({
  name: 'addContactToOrganisation',
  params: {
    organisationId: String,
    contactId: String,
    metadata: Object,
  },
});

export const addUserToOrganisation = new Method({
  name: 'addUserToOrganisation',
  params: {
    organisationId: String,
    userId: String,
    metadata: Object,
  },
});

export const removeUserFromOrganisation = new Method({
  name: 'removeUserFromOrganisation',
  params: {
    organisationId: String,
    userId: String,
  },
});

export const setCommissionRates = new Method({
  name: 'setCommissionRates',
  params: {
    organisationId: String,
    commissionRates: Object,
  },
});
