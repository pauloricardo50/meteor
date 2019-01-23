import { Method } from '../methods/methods';

export const contactInsert = new Method({
  name: 'contactInsert',
  params: {
    contact: Object,
  },
});

export const contactRemove = new Method({
  name: 'contactRemove',
  params: {
    contactId: String,
  },
});

export const contactUpdate = new Method({
  name: 'contactUpdate',
  params: {
    contactId: String,
    object: Object,
  },
});

export const contactChangeOrganisations = new Method({
  name: 'contactChangeOrganisations',
  params: {
    contactId: String,
    newOrganisations: Array,
  },
});
