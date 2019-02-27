// @flow
import React from 'react';
import Input from '@material-ui/core/Input';

import List, {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from 'core/components/List';
import DialogSimple from 'core/components/DialogSimple';
import Button from 'core/components/Button/Button';
import T from 'core/components/Translation';
import { getUserNameAndOrganisation } from 'imports/core/api/helpers';
import ProPropertyProUserAdderContainer from './ProPropertyProUserAdderContainer';

type ProPropertyProUserAdderProps = {
  property: Object,
  searchQuery: String,
  onSearch: Function,
  setSearchQuery: Function,
  searchResults: Array<Object>,
  addUser: Function,
};

const ProPropertyProUserAdder = ({
  searchQuery,
  setSearchQuery,
  onSearch,
  searchResults,
  addUser,
  property,
}: ProPropertyProUserAdderProps) => (
  <DialogSimple
    primary
    raised
    label={<T id="AdminPromotionPage.addUser.label" />}
    title={<T id="AdminPromotionPage.addUser.title" />}
  >
  {console.log('property', property)}
    <div className="flex-col">
      <form onSubmit={onSearch}>
        <Input
          type="text"
          value={searchQuery}
          onChange={event => setSearchQuery(event.target.value)}
          placeholder="Rechercher..."
          style={{ width: '100%', marginBottom: '16px' }}
        />
      </form>
      <List className="flex-col user-list">
        {searchResults
          && searchResults.map(user => (
            <ListItem key={user._id} className="user">
              <ListItemText primary={getUserNameAndOrganisation({ user })} />
              <ListItemSecondaryAction>
                <Button
                  onClick={() => addUser({ userId: user._id })}
                  primary
                  disabled={
                      property.users
                      && property.users.map(({ _id }) => _id).includes(user._id)
                  }
                >
                  <T id="AdminPromotionPage.addUser" />
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
      </List>
      {searchResults.length === 0 && (
        <p>
          <T id="AdminPromotionPage.noUserFound" />
        </p>
      )}
    </div>
  </DialogSimple>
);

export default ProPropertyProUserAdderContainer(ProPropertyProUserAdder);
