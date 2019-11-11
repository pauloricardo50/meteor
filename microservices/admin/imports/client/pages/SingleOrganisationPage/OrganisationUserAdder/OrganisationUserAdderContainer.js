import { compose, withProps, withStateHandlers } from 'recompose';
import { addUserToOrganisation } from 'core/api';
import { userSearch } from 'core/api/users/queries';
import { ROLES } from 'core/api/constants';

export default compose(
  withStateHandlers(
    () => ({
      searchQuery: '',
      searchResults: [],
      userId: null,
      title: null,
    }),
    {
      setSearchQuery: () => searchQuery => ({ searchQuery }),
      setSearchResults: () => searchResults => ({ searchResults }),
      setUserId: () => userId => ({ userId }),
      setTitle: () => title => ({ title }),
    },
  ),
  withProps(
    ({
      searchQuery,
      setSearchResults,
      setSearchQuery,
      setUserId,
      setTitle,
      organisation,
    }) => ({
      onSearch: event => {
        event.preventDefault();
        event.stopPropagation();
        userSearch
          .clone({ searchQuery, roles: [ROLES.PRO, ROLES.ADMIN, ROLES.DEV] })
          .fetch((err, users) => {
            if (err) {
              throw err;
            }
            setSearchResults(
              organisation.users
                ? users.filter(
                    user =>
                      !organisation.users
                        .map(({ _id }) => _id)
                        .includes(user._id),
                  )
                : users,
            );
          });
      },
      addUser: ({ userId, title }) =>
        addUserToOrganisation.run({
          organisationId: organisation._id,
          userId,
          metadata: { title },
        }),
      resetState: () => {
        setSearchQuery('');
        setUserId(null);
        setTitle(null);
        setSearchResults([]);
      },
    }),
  ),
);
