import React from 'react';
import { withState, compose, withProps } from 'recompose';

import { addProUserToProperty, getUserByEmail } from 'core/api';
import userSearch from 'core/api/users/queries/userSearch';
import { ROLES } from 'core/api/constants';
import withContextConsumer from 'core/api/containerToolkit/withContextConsumer';
import { ProPropertyPageContext } from '../../ProPropertyPageContext';
import T from '../../../Translation';

const searchUser = ({ isAdmin, searchQuery, setSearchResult }) => {
  if (isAdmin) {
    return userSearch
      .clone({ searchQuery, roles: [ROLES.PRO] })
      .fetch((err, users) => {
        if (err) {
          setSearchResult({ error: err });
        }

        setSearchResult(users);
      });
  }

  getUserByEmail.run({ email: searchQuery }).then((user) => {
    if (!user) {
      return setSearchResult({
        error: <T id="ProPropertyPage.proUserAdder.noUserFound" />,
      });
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
        return searchUser({ isAdmin, searchQuery, setSearchResult });
      }

      setSearchResult(null);
    },
    addUser: ({ userId }) =>
      addProUserToProperty.run({ propertyId: property._id, userId }),
  })),
);
