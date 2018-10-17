// @flow
import React from 'react';
import DialogSimple from 'core/components/DialogSimple';
import userSearch from 'core/api/users/queries/userSearch';
import { withState, compose, withProps } from 'recompose';
import Button from 'core/components/Button/Button';
import { ROLES } from 'core/api/constants';
import { addProUserToPromotion } from 'core/api';
import T from 'core/components/Translation';

type PromotionProUserAdderProps = {
  promotion: Object,
};

const PromotionProUserAdder = ({
  searchQuery,
  setSearchQuery,
  search,
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
      <form onSubmit={search}>
        <input
          type="text"
          value={searchQuery}
          onChange={event => setSearchQuery(event.target.value)}
          placeHolder="Rechercher un utilisateur"
          style={{ width: '100%', marginBottom: '16px' }}
        />
      </form>
      {searchResults.map(user => (
        <div key={user._id} className="user">
          <span>{user.name}</span>
          <Button
            onClick={() => addUser({ userId: user._id })}
            primary
            disabled={promotion.users.map(({ _id }) => _id).includes(user._id)}
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

export default compose(
  withState('searchQuery', 'setSearchQuery', ''),
  withState('searchResults', 'setSearchResults', []),
  withProps(({ searchQuery, setSearchResults, promotion }) => ({
    search: (event) => {
      event.preventDefault();
      userSearch
        .clone({ searchQuery, roles: [ROLES.PRO] })
        .fetch((err, users) => {
          if (err) {
            throw err;
          }
          setSearchResults(users.filter(user => !promotion.users.map(({ _id }) => _id).includes(user._id)));
        });
    },
    addUser: ({ userId }) =>
      addProUserToPromotion.run({
        promotionId: promotion._id,
        userId,
      }),
  })),
)(PromotionProUserAdder);
