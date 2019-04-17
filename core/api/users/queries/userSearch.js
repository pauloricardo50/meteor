import { Users } from '../..';
import { USER_QUERIES } from '../userConstants';
import {
  createRegexQuery,
  generateMatchAnyWordRegexp,
} from '../../helpers/mongoHelpers';

const queryHasSpace = query => query.indexOf(' ') > -1;

export default Users.createQuery(USER_QUERIES.USER_SEARCH, {
  $filter({ filters, params: { searchQuery, roles } }) {
    const formattedSearchQuery = generateMatchAnyWordRegexp(searchQuery);
    if (roles) {
      filters.roles = { $in: roles };
    }
    filters.$or = [
      createRegexQuery('_id', searchQuery),
      createRegexQuery('emails.0.address', searchQuery),
      createRegexQuery('firstName', searchQuery),
      createRegexQuery('lastName', searchQuery),
      {
        $and: [
          createRegexQuery('firstName', formattedSearchQuery),
          createRegexQuery('lastName', formattedSearchQuery),
        ],
      },
    ];

    if (queryHasSpace(searchQuery)) {
      filters.$or.push();
    }
  },
  assignedEmployee: { name: 1 },
  createdAt: 1,
  email: 1,
  name: 1,
  organisations: { name: 1 },
  roles: 1,
  $options: { limit: 5 },
});
