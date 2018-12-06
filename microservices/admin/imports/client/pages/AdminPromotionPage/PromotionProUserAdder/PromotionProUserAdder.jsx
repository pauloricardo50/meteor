// @flow
import React from 'react';
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
    <div className="search-pro-users">
      <form onSubmit={onSearch}>
        <input
          type="text"
          value={searchQuery}
          onChange={event => setSearchQuery(event.target.value)}
          placeHolder="Rechercher un utilisateur"
          style={{ width: '100%', marginBottom: '16px' }}
        />
      </form>
      {searchResults
        && searchResults.map(user => (
          <div key={user._id} className="user">
            <span>{user.name}</span>
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
          </div>
        ))}
      {searchResults.length === 0 && (
        <p>
          <T id="AdminPromotionPage.noUserFound" />
        </p>
      )}
    </div>
  </DialogSimple>
);

export default PromotionProUserAdderContainer(PromotionProUserAdder);
