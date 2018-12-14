// @flow
import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Input from '@material-ui/core/Input';

import DialogSimple from 'core/components/DialogSimple';
import Button from 'core/components/Button/Button';
import T from 'core/components/Translation';
import PromotionProUserAdderContainer from './PromotionProUserAdderContainer';

type PromotionProUserAdderProps = {
  promotion: Object,
  searchQuery: String,
  onSearch: Function,
  setSearchQuery: Function,
  searchResults: Array<Object>,
  addUser: Function,
};

const PromotionProUserAdder = ({
  searchQuery,
  setSearchQuery,
  onSearch,
  searchResults,
  addUser,
  promotion,
}: PromotionProUserAdderProps) => (
  <DialogSimple
    primary
    raised
    label={<T id="AdminPromotionPage.addUser.label" />}
    title={<T id="AdminPromotionPage.addUser.title" />}
  >
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
      <List className="flex-col">
        {searchResults
          && searchResults.map(user => (
            <ListItem key={user._id} className="user">
              <ListItemText primary={user.name} />
              <ListItemSecondaryAction>
                <Button
                  onClick={() => addUser({ userId: user._id })}
                  primary
                  disabled={
                    promotion.users
                    && promotion.users.map(({ _id }) => _id).includes(user._id)
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

export default PromotionProUserAdderContainer(PromotionProUserAdder);
