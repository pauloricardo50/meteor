import { withState, compose, withProps } from 'recompose';
import { addProUserToPromotion } from 'core/api';
import { userSearch } from 'core/api/users/queries';
import { ROLES } from 'core/api/constants';

export default compose(
  withState('searchQuery', 'setSearchQuery', ''),
  withState('searchResults', 'setSearchResults', []),
  withProps(({ searchQuery, setSearchResults, promotion }) => ({
    onSearch: (event) => {
      event.preventDefault();
      userSearch
        .clone({ searchQuery, roles: [ROLES.PRO] })
        .fetch((err, users) => {
          if (err) {
            throw err;
          }
          setSearchResults(promotion.users
            ? users.filter(user =>
              !promotion.users.map(({ _id }) => _id).includes(user._id))
            : users);
        });
    },
    addUser: ({ userId }) =>
      addProUserToPromotion.run({
        promotionId: promotion._id,
        userId,
      }),
  })),
);
