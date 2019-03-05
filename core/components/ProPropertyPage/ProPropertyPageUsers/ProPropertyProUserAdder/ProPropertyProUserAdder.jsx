// @flow
import React from 'react';
import Input from '@material-ui/core/Input';

import DialogSimple from 'core/components/DialogSimple';
import T from 'core/components/Translation';
import ProPropertyProUserAdderContainer from './ProPropertyProUserAdderContainer';
import UsersList from './UsersList';

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
      {typeof searchResults === 'object' && searchResults.error ? (
        <p>{searchResults.error}</p>
      ) : (
        <UsersList
          users={searchResults}
          property={property}
          addUser={addUser}
        />
      )}
    </div>
  </DialogSimple>
);

export default ProPropertyProUserAdderContainer(ProPropertyProUserAdder);
