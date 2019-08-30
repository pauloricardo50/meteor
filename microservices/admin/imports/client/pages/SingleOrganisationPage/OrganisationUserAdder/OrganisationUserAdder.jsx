// @flow
import React from 'react';

import List, {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from 'core/components/List';
import DialogSimple from 'core/components/DialogSimple';
import Button from 'core/components/Button/Button';
import T from 'core/components/Translation';
import TextField from 'imports/core/components/Material/TextField';
import OrganisationUserAdderContainer from './OrganisationUserAdderContainer';

type OrganisationUserAdderProps = {
  organisation: Object,
  searchQuery: String,
  onSearch: Function,
  setSearchQuery: Function,
  searchResults: Array<Object>,
  setSearchResults: Function,
  addUser: Function,
  userId: String,
  setUserId: Function,
  setTitle: Function,
  title: String,
  resetState: Function,
};

const renderUserSearcher = ({
  searchQuery,
  setSearchQuery,
  onSearch,
  searchResults,
  organisation,
  setUserId,
}) => (
  <>
    <form onSubmit={onSearch}>
      <TextField
        key="user"
        value={searchQuery}
        onChange={event => setSearchQuery(event.target.value)}
        placeholder="Rechercher..."
        style={{ width: '100%', marginBottom: '16px' }}
      />
    </form>
    <List className="flex-col" style={{ width: '250px' }}>
      {searchResults
        && searchResults.map(user => (
          <ListItem key={user._id} className="user">
            <ListItemText primary={user.name} />
            <ListItemSecondaryAction>
              <Button
                onClick={() => setUserId(user._id)}
                primary
                disabled={
                  organisation.users
                  && organisation.users.map(({ _id }) => _id).includes(user._id)
                }
              >
                Ajouter
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
    </List>
    {searchResults.length === 0 && <p>Aucun compte trouvé</p>}
  </>
);

const renderTitleSetter = ({
  addUser,
  userId,
  title,
  setTitle,
  handleClose,
  resetState,
}) => (
  <form
    onSubmit={(event) => {
      event.preventDefault();
      event.stopPropagation();
      return addUser({ userId, title })
        .then(resetState)
        .then(handleClose);
    }}
  >
    <TextField
      label="Titre"
      key="title"
      type="text"
      value={title}
      onChange={event => setTitle(event.target.value)}
      placeholder="Courtier"
      style={{ width: '100%', marginBottom: '16px' }}
    />
    <Button primary raised type="submit">
      Ajouter
    </Button>
  </form>
);

const OrganisationUserAdder = (props: OrganisationUserAdderProps) => {
  const {
    setSearchQuery,
    setTitle,
    setSearchResults,
    setUserId,
    userId,
    resetState,
  } = props;

  return (
    <DialogSimple
      primary
      raised
      label="Ajouter un compte existant"
      title="Ajouter compte"
      style={{ width: '100%' }}
      renderProps
      actions={handleClose => [
        <Button
          label={<T id="general.close" />}
          onClick={() => {
            resetState();
            handleClose();
          }}
          key="close"
        />,
      ]}
    >
      {({ handleClose }) => (
        <div className="flex-col">
          {!userId
            ? renderUserSearcher(props)
            : renderTitleSetter({
              ...props,
              handleClose,
            })}
        </div>
      )}
    </DialogSimple>
  );
};

export default OrganisationUserAdderContainer(OrganisationUserAdder);
