import Contacts from '../contacts';
import { CONTACTS_QUERIES } from '../contactsConstants';
import {
  generateMatchAnyWordRegexp,
  createRegexQuery,
} from '../../helpers/mongoHelpers';

export default Contacts.createQuery(CONTACTS_QUERIES.CONTACT_SEARCH, {
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
});
