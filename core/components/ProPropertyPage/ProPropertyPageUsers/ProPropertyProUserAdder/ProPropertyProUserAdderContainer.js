import { withState, compose, withProps } from 'recompose';

import { addProUserToProperty, getUserByEmail } from 'core/api';
import userSearch from 'core/api/users/queries/userSearch';
import { ROLES } from 'core/api/constants';
import withContextConsumer from 'core/api/containerToolkit/withContextConsumer';
import { ProPropertyPageContext } from '../../ProPropertyPageContext';

const searchUser = ({ isAdmin, searchQuery, setSearchResult }) => {
  if (isAdmin) {
    userSearch
      .clone({ searchQuery, roles: [ROLES.PRO] })
      .fetch((err, users) => {
        if (err) {
          setSearchResult({ error: err });
        }

        setSearchResult(users);
      });
    return;
  }

  getUserByEmail.run({ email: searchQuery, roles: [ROLES.PRO] }).then((user) => {
    if (!user) {
      setSearchResult({
        error:
          'Aucun utilisateur trouvé. Contactez e-Potek pour ajouter ce compte.',
      });
      return;
    }

    setSearchResult([user]);
  });
};

export default compose(
  withContextConsumer({ Context: ProPropertyPageContext }),
  withState('searchQuery', 'setSearchQuery', null),
  withState('searchResult', 'setSearchResult', null),
  withProps(({ searchQuery, setSearchResult, property, permissions: { isAdmin } }) => ({
    onSearch: (event) => {
      event.preventDefault();
      if (searchQuery) {
        searchUser({ isAdmin, searchQuery, setSearchResult });
        return;
      }

      setSearchResult(null);
    },
    addUser: ({ userId }) =>
      addProUserToProperty.run({
        propertyId: property._id,
        userId,
      }),
  })),
);
