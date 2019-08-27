// @flow
import React from 'react';

import Input from '../Material/Input';
import DialogSimple from '../DialogSimple';
import T from '../Translation';
import List, { ListItem, ListItemText } from '../List';
import UserAssignerContainer from './UserAssignerContainer';

type UserAssignerProps = {
  userId: String,
  searchQuery: String,
  onSearch: Function,
  setSearchQuery: Function,
  searchResults: Array<Object>,
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
  searchQuery,
  setSearchQuery,
  onSearch,
  searchResults,
}: UserAssignerProps) => (
  <DialogSimple primary raised label={buttonLabel} title={title}>
    <div className="flex-col">
      <form onSubmit={onSearch}>
        <Input
          type="text"
          value={searchQuery}
          onChange={event => setSearchQuery(event.target.value)}
          placeholder="Chercher..."
          style={{ width: '100%', marginBottom: '16px' }}
        />
      </form>
      <List className="flex-col">
        {searchResults
          && searchResults.map(user => (
            <ListItem
              key={user._id}
              onClick={() =>
                (user._id === userId ? onUserDeselect() : onUserSelect(user._id))
              }
              button
            >
              <ListItemText
                primaryTypographyProps={
                  user._id === userId ? { color: 'primary' } : {}
                }
                primary={user.name}
                secondary={user.email}
              />
            </ListItem>
          ))}
      </List>
      {searchResults && searchResults.length === 0 && (
        <p>Pas d'utilisateur trouvé</p>
      )}
    </div>
  </DialogSimple>
);

export default UserAssignerContainer(UserAssigner);
