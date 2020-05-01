import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import React, { useContext, useState } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';
import SimpleSchema from 'simpl-schema';

import { FILE_STATUS } from '../../../api/files/fileConstants';
import { shouldDisplayFile } from '../../../api/files/fileHelpers';
import { getSignedUrl } from '../../../api/files/methodDefinitions';
import { ROLES } from '../../../api/users/userConstants';
import { FileViewerContext } from '../../../containers/FileViewerContext';
import Downloader from '../../Downloader';
import IconButton from '../../IconButton';
import { ModalManagerContext } from '../../ModalManager';
import DialogForm from '../../ModalManager/DialogForm';
import FileDeleter from './FileDeleter';
import FileErrorModifier from './FileErrorModifier';
import FileRolesSetter from './FileRolesSetter';
import FileStatusSetter from './FileStatusSetter';

const isAllowedToDelete = (disabled, status) => {
  const currentUser = Meteor.user();
  const userIsDev = Roles.userIsInRole(currentUser, ROLES.DEV);
  const userIsAdmin = Roles.userIsInRole(currentUser, ROLES.ADMIN);
  const userIsPro = Roles.userIsInRole(currentUser, ROLES.PRO);
  if (userIsDev || userIsAdmin || userIsPro) {
    return true;
  }

  return !disabled && status !== FILE_STATUS.VALID;
};

const getDisplayName = (name, adminName) => {
  if (Meteor.microservice !== 'admin') {
    return name;
  }

  if (adminName) {
    return (
      <Tooltip title={`Nom original: ${name}`}>
        <a>{`${adminName}.${name.split('.').slice(-1)[0]}`}</a>
      </Tooltip>
    );
  }

  return <a>{name}</a>;
};

const makeOnDragStart = ({ draggable, ...dragProps }) => {
  if (!draggable) {
    return;
  }

  return event => {
    event.dataTransfer.setData('move', true);
    Object.keys(dragProps).forEach(prop => {
      const value = dragProps[prop];
      event.dataTransfer.setData(prop, value);
    });
  };
};

const schema = new SimpleSchema({
  adminName: { type: String, optional: true },
});

const File = props => {
  const {
    file: { name, Key, status, message, url, adminname: adminName, roles },
    disabled,
    handleRemove,
    dragProps,
    handleRenameFile,
    handleChangeError,
    draggable,
    handleChangeFileStatus,
    allowSetRoles,
    handleSetRoles,
  } = props;
  const { displayFile } = useContext(FileViewerContext) || {};
  const { openModal } = useContext(ModalManagerContext);
  const [deleting, setDeleting] = useState(false);

  if (!shouldDisplayFile({ roles })) {
    return null;
  }

  return (
    <div className="flex-col">
      <div className="file">
        <h5
          className="secondary bold file-name"
          onClick={event => {
            if (Meteor.microservice === 'admin') {
              event.preventDefault();
              getSignedUrl.run({ key: Key }).then(signedUrl => {
                displayFile(
                  signedUrl,
                  url
                    .split('.')
                    .slice(-1)[0]
                    .toLowerCase(),
                );
              });
            }
          }}
          draggable={draggable}
          onDragStart={makeOnDragStart({
            draggable,
            Key,
            status,
            name,
            ...dragProps,
          })}
        >
          {getDisplayName(name, adminName)}
        </h5>
        <div className="actions flex center">
          {handleChangeFileStatus && (
            <FileStatusSetter
              status={status}
              fileKey={Key}
              error={message}
              handleChangeFileStatus={handleChangeFileStatus}
            />
          )}
          {Meteor.microservice === 'admin' && (
            <IconButton
              type="edit"
              tooltip="<ADMIN> Renommer le fichier"
              onClick={event => {
                event.preventDefault();
                openModal(
                  <DialogForm
                    schema={schema}
                    model={{ adminName }}
                    title="Renommer le fichier"
                    description="Entrez le nouveau nom. Il ne sera visible uniquement que par les admins."
                    className="animated fadeIn"
                    important
                    onSubmit={({ adminName: newName }) =>
                      handleRenameFile(newName, Key)
                    }
                  />,
                );
              }}
              size="small"
            />
          )}
          <FileRolesSetter
            roles={roles}
            Key={Key}
            allowSetRoles={allowSetRoles}
            handleSetRoles={handleSetRoles}
            name={name}
          />

          {isAllowedToDelete(disabled, status) && (
            <FileDeleter
              deleting={deleting}
              setDeleting={setDeleting}
              openModal={openModal}
              handleRemove={handleRemove}
              Key={Key}
              name={name}
            />
          )}
          <Downloader fileKey={Key} fileName={name} size="small" />
        </div>
      </div>
      {message && status === FILE_STATUS.ERROR && (
        <p className="error file-error">
          {message}
          {Meteor.microservice === 'admin' && (
            <FileErrorModifier
              deleting={deleting}
              openModal={openModal}
              message={message}
              handleChangeError={handleChangeError}
              Key={Key}
            />
          )}
        </p>
      )}
    </div>
  );
};

File.propTypes = {
  disabled: PropTypes.bool.isRequired,
  file: PropTypes.objectOf(PropTypes.any).isRequired,
  handleRemove: PropTypes.func.isRequired,
};

export default File;
