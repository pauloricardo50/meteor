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
  searchResult: Object,
  addUser: Function,
  organisation: Object,
};

const showUsers = ({ users, searchResult, property, addUser, isAdmin }) => {
  if (searchResult) {
    if (searchResult.error) {
      return <p>{searchResult.error}</p>;
    }

    return (
      <UsersList users={searchResult} property={property} addUser={addUser} />
    );
  }

  if (users.length) {
    return <UsersList users={users} property={property} addUser={addUser} />;
  }

  return (
    <p>
      {isAdmin ? (
        <T id="ProPropertyPage.proUserAdder.notFound" />
      ) : (
        <T id="ProPropertyPage.proUserAdder.notFoundInOrg" />
      )}
    </p>
  );
};

const ProPropertyProUserAdder = ({
  searchQuery,
  setSearchQuery,
  onSearch,
  searchResult,
  setSearchResult,
  addUser,
  property,
  organisation: { users = [] } = {},
  permissions: { isAdmin },
}: ProPropertyProUserAdderProps) => (
  <DialogSimple
    primary
    raised
    label={<T id="ProPropertyPage.addUser.label" />}
    title={<T id="ProPropertyPage.addUser.title" />}
    text={<T id="ProPropertyPage.addUser.description" />}
    closeOnly
    onClose={() => {
      setSearchQuery(null);
      setSearchResult(null);
    }}
  >
    <div className="flex-col">
      <form onSubmit={onSearch}>
        <Input
          type="text"
          value={searchQuery}
          onChange={event => setSearchQuery(event.target.value)}
          placeholder={isAdmin ? 'Rechercher...' : 'Rechercher par email...'}
          style={{ width: '100%', margin: '16px 0' }}
        />
      </form>
      {showUsers({ users, searchResult, property, addUser, isAdmin })}
    </div>
  </DialogSimple>
);

export default ProPropertyProUserAdderContainer(ProPropertyProUserAdder);
