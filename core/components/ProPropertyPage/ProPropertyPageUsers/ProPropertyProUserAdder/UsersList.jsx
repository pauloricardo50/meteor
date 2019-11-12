// @flow
import React from 'react';

import List, {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from 'core/components/List';
import Button from 'core/components/Button';
import T from 'core/components/Translation';
import { getUserNameAndOrganisation } from 'core/api/helpers';

type UsersListProps = {
  users: Array<Object>,
  property: Object,
  addUser: Function,
};

const UsersList = ({ users, property, addUser }: UsersListProps) =>
  users && !!users.length ? (
    <List className="flex-col user-list">
      {users.map(user => (
        <ListItem key={user._id} className="user">
          <ListItemText primary={getUserNameAndOrganisation({ user })} />
          <ListItemSecondaryAction>
            <Button
              onClick={() => addUser({ userId: user._id })}
              primary
              disabled={
                property.users &&
                property.users.map(({ _id }) => _id).includes(user._id)
              }
            >
              <T id="Forms.add" />
            </Button>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  ) : (
    <p>
      <T id="AdminPromotionPage.noUserFound" />
    </p>
  );

export default UsersList;
