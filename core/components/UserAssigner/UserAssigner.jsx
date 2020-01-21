// @flow
import React from 'react';

import { userSearch } from 'core/api/users/queries';
import DialogSimple from '../DialogSimple';
import { ListItemText } from '../List';
import UserAssignerContainer from './UserAssignerContainer';
import CollectionSearch from '../CollectionSearch/CollectionSearch';

type UserAssignerProps = {
  userId: String,
  onUserSelect: Function,
  onUserDeselect: Function,
  title: any,
  buttonLabel: any,
};

const UserAssigner = ({
  userId,
  onUserSelect,
  onUserDeselect,
  title,
  buttonLabel,
}: UserAssignerProps) => (
  <DialogSimple primary raised label={buttonLabel} title={title}>
    <CollectionSearch
      query={userSearch}
      title="Rechercher un compte"
      onClickItem={user =>
        user._id === userId ? onUserDeselect() : onUserSelect(user._id)
      }
      renderItem={user => (
        <ListItemText
          primaryTypographyProps={
            user._id === userId ? { color: 'primary' } : {}
          }
          primary={user.name}
          secondary={user.email}
        />
      )}
      type="list"
    />
  </DialogSimple>
);

export default UserAssignerContainer(UserAssigner);
