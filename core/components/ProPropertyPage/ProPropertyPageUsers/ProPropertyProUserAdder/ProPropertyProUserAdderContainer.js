import { withState, compose, withProps } from 'recompose';
import { addProUserToProperty } from 'core/api';
import userSearch from 'core/api/users/queries/userSearch';
import { ROLES } from 'core/api/constants';

export default compose(
  withState('searchQuery', 'setSearchQuery', ''),
  withState('searchResults', 'setSearchResults', []),
  withProps(({ searchQuery, setSearchResults, property }) => ({
    onSearch: (event) => {
      event.preventDefault();
      userSearch
        .clone({ searchQuery, roles: [ROLES.PRO] })
        .fetch((err, users) => {
          if (err) {
            throw err;
          }
            setSearchResults(property.users
            ? users.filter(user =>
                !property.users.map(({ _id }) => _id).includes(user._id))
            : users);
        });
    },
    addUser: ({ userId }) =>
        addProUserToProperty.run({
          propertyId: property._id,
        userId,
      }),
  })),
);
