// @flow
import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Input from '@material-ui/core/Input';

import DialogSimple from '../DialogSimple';
import T from '../Translation';
import UserAssignerContainer from './UserAssignerContainer';

type UserAssignerProps = {
  userId: String,
  searchQuery: String,
  onSearch: Function,
  setSearchQuery: Function,
  searchResults: Array<Object>,
  onUserSelect: Function,
  title: any,
  buttonLabel: any,
};

const UserAssigner = ({
  userId,
  onUserSelect,
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
          placeHolder="Rechercher un utilisateur"
          style={{ width: '100%', marginBottom: '16px' }}
        />
      </form>
      <List className="flex-col">
        {searchResults
          && searchResults.map(user => (
            <ListItem
              key={user._id}
              onClick={() => onUserSelect(user._id)}
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
        <p>
          <T id="UserAssigner.noUserFound" />
        </p>
      )}
    </div>
  </DialogSimple>
);

export default UserAssignerContainer(UserAssigner);
