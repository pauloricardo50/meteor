import { Users } from '../..';
import { USER_QUERIES } from '../userConstants';
import {
  createRegexQuery,
  generateMatchAnyWordRegexp,
} from '../../helpers/mongoHelpers';
import { adminUser } from '../../fragments';

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
      createRegexQuery('organisation', searchQuery),
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
  ...adminUser(),
  $options: { limit: 5 },
});
