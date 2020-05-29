import { CONTACTS_QUERIES } from './contactsConstants';
import Contacts from '.';

export const contactSearch = Contacts.createQuery(
  CONTACTS_QUERIES.CONTACT_SEARCH,
  {
    name: 1,
    organisations: { name: 1 },
    $options: { sort: { createdAt: -1 }, limit: 5 },
  },
);
