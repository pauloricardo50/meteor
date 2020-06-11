import { Match } from 'meteor/check';

import { Method } from '../methods/methods';

export const lenderInsert = new Method({
  name: 'lenderInsert',
  params: {
    lender: Object,
    organisationId: String,
    contactId: Match.OneOf(String, null),
  },
});

export const lenderRemove = new Method({
  name: 'lenderRemove',
  params: {
    lenderId: String,
  },
});

export const lenderUpdate = new Method({
  name: 'lenderUpdate',
  params: {
    lenderId: String,
    object: Object,
  },
});

export const lenderLinkOrganisationAndContact = new Method({
  name: 'lenderLinkOrganisationAndContact',
  params: {
    lenderId: String,
    organisationId: Match.OneOf(String, null),
    contactId: Match.OneOf(String, null),
  },
});
