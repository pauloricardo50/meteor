import React from 'react';

import { addProUserToProperty, getUserByEmail } from '../../../../api';
import withContextConsumer from '../../../../api/containerToolkit/withContextConsumer';
import { getUserNameAndOrganisation } from '../../../../api/helpers';
import { userSearch } from '../../../../api/users/queries';
import { ROLES } from '../../../../api/users/userConstants';
import CollectionSearch from '../../../CollectionSearch';
import DialogSimple from '../../../DialogSimple';
import T from '../../../Translation';
import { ProPropertyPageContext } from '../../ProPropertyPageContext';

const ProPropertyProUserAdder = ({ property, permissions: { isAdmin } }) => {
  const { users: proUsers = [] } = property;
  return (
    <DialogSimple
      primary
      raised
      label={<T id="ProPropertyPage.addUser.label" />}
      title={<T id="ProPropertyPage.addUser.title" />}
      text={<T id="ProPropertyPage.addUser.description" />}
    >
      <CollectionSearch
        query={isAdmin && userSearch}
        title="Rechercher un compte Pro"
        queryParams={{ roles: [ROLES.PRO] }}
        method={!isAdmin && getUserByEmail}
        methodParams={({ searchQuery }) => ({ email: searchQuery })}
        placeholder={isAdmin ? 'Rechercher...' : 'Rechercher par email...'}
        resultsFilter={(results = []) =>
          results.filter(
            user => !proUsers.map(({ _id }) => _id).includes(user._id),
          )
        }
        renderItem={user => <span>{getUserNameAndOrganisation({ user })}</span>}
        onClickItem={({ _id: userId }) =>
          addProUserToProperty.run({ propertyId: property._id, userId })
        }
        disableItem={({ _id: userId }) =>
          proUsers.map(({ _id }) => _id).includes(userId)
        }
      />
    </DialogSimple>
  );
};

export default withContextConsumer({ Context: ProPropertyPageContext })(
  ProPropertyProUserAdder,
);
