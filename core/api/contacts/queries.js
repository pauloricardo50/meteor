import { contact } from '../fragments';
import {
  generateMatchAnyWordRegexp,
  createRegexQuery,
} from '../helpers/mongoHelpers';
import Contacts from '.';
import { CONTACTS_QUERIES } from './contactsConstants';

export const adminContacts = Contacts.createQuery(
  CONTACTS_QUERIES.ADMIN_CONTACTS,
  contact(),
);

export const contactSearch = Contacts.createQuery(
  CONTACTS_QUERIES.CONTACT_SEARCH,
  {
    $filter({ filters, params: { searchQuery } }) {
      const formattedSearchQuery = generateMatchAnyWordRegexp(searchQuery);

      filters.$or = [
        createRegexQuery('_id', searchQuery),
        createRegexQuery('firstName', searchQuery),
        createRegexQuery('lastName', searchQuery),
        {
          $and: [
            createRegexQuery('firstName', formattedSearchQuery),
            createRegexQuery('lastName', formattedSearchQuery),
          ],
        },
      ];
    },
    name: 1,
    organisations: { name: 1 },
    $options: { sort: { createdAt: -1 }, limit: 5 },
  },
);
