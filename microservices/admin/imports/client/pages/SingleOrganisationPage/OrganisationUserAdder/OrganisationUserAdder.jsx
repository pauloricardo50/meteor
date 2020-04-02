import React from 'react';
import TextField from 'imports/core/components/Material/TextField';

import { userSearch } from 'core/api/users/queries';
import { ROLES } from 'core/api/users/userConstants';
import Button from 'core/components/Button/Button';
import CollectionSearch from 'core/components/CollectionSearch/CollectionSearch';
import DialogSimple from 'core/components/DialogSimple';
import Icon from 'core/components/Icon';
import { ListItemSecondaryAction, ListItemText } from 'core/components/List';
import T from 'core/components/Translation';

import OrganisationUserAdderContainer from './OrganisationUserAdderContainer';

const renderUserSearcher = ({ organisation, setUserId }) => (
  <CollectionSearch
    query={userSearch}
    queryParams={{ roles: [ROLES.PRO, ROLES.ADMIN, ROLES.DEV] }}
    title="Rechercher un utilisateur"
    renderItem={user => (
      <>
        <ListItemText primary={user.name} />
        <ListItemSecondaryAction>
          <Button onClick={() => setUserId(user._id)} primary>
            Ajouter
          </Button>
        </ListItemSecondaryAction>
      </>
    )}
    disableItem={user =>
      organisation.users &&
      organisation.users.map(({ _id }) => _id).includes(user._id)
    }
    type="list"
  />
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
    onSubmit={event => {
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

const OrganisationUserAdder = props => {
  const { resetState, userId } = props;

  return (
    <DialogSimple
      primary
      raised
      label="Compte existant"
      buttonProps={{ icon: <Icon type="add" /> }}
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
