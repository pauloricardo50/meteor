import { compose, withProps, withStateHandlers } from 'recompose';
import { addUserToOrganisation } from 'core/api';
import userSearch from 'core/api/users/queries/userSearch';
import { ROLES } from 'core/api/constants';

export default compose(
  withStateHandlers(
    () => ({
      searchQuery: '',
      searchResults: [],
      userId: null,
      role: null,
    }),
    {
      setSearchQuery: () => searchQuery => ({ searchQuery }),
      setSearchResults: () => searchResults => ({ searchResults }),
      setUserId: () => userId => ({ userId }),
      setRole: () => role => ({ role }),
    },
  ),
  withProps(({
    searchQuery,
    setSearchResults,
    setSearchQuery,
    setUserId,
    setRole,
    organisation,
  }) => ({
    onSearch: (event) => {
      event.preventDefault();
      event.stopPropagation();
      userSearch
        .clone({ searchQuery, roles: [ROLES.PRO, ROLES.ADMIN, ROLES.DEV] })
        .fetch((err, users) => {
          if (err) {
            throw err;
          }
          setSearchResults(organisation.users
            ? users.filter(user =>
              !organisation.users
                .map(({ _id }) => _id)
                .includes(user._id))
            : users);
        });
    },
    addUser: ({ userId, role }) =>
      addUserToOrganisation.run({
        organisationId: organisation._id,
        userId,
        metadata: { role },
      }),
    resetState: () => {
      setSearchQuery('');
      setUserId(null);
      setRole(null);
      setSearchResults([]);
    },
  })),
);
