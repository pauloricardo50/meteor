import React from 'react';

import { userSearch } from '../../api/users/queries';
import CollectionSearch from '../CollectionSearch';
import DialogSimple from '../DialogSimple';
import { ListItemText } from '../List';

const UserAssigner = ({
  userId,
  onUserSelect,
  onUserDeselect,
  title,
  buttonLabel,
}) => (
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

export default UserAssigner;
