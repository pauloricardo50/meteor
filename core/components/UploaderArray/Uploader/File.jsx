import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import Tooltip from '@material-ui/core/Tooltip';

import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import SimpleSchema from 'simpl-schema';

import DialogForm from 'core/components/ModalManager/DialogForm';
import { ModalManagerContext } from '../../ModalManager';
import { FILE_STATUS, ROLES } from '../../../api/constants';
import { getSignedUrl } from '../../../api/methods';
import { FileViewerContext } from '../../../containers/FileViewerContext';
import T from '../../Translation';
import IconButton from '../../IconButton';
import Downloader from '../../Downloader';
import FileStatusSetter from './FileStatusSetter';
import Button from '../../Button';

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

const File = props => {
  const {
    file: { name, Key, status, message, url, adminname: adminName, proonly },
    disabled,
    handleRemove,
    dragProps,
    handleRenameFile,
    handleChangeError,
    handleToggleProOnly,
    draggable,
    handleChangeFileStatus,
    allowToggleProOnly,
  } = props;
  const proOnly = proonly === 'true';
  const { displayFile } = useContext(FileViewerContext) || {};
  const { openModal } = useContext(ModalManagerContext);
  const [deleting, setDeleting] = useState(false);

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
            ...dragProps,
          })}
        >
          {getDisplayName(name, adminName)}
          {Meteor.microservice === 'admin' && proOnly && ' (document pro)'}
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
                    schema={
                      new SimpleSchema({
                        adminName: { type: String, optional: true },
                      })
                    }
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
          {allowToggleProOnly && (
            <IconButton
              type={proOnly ? 'lock' : 'lockOpen'}
              tooltip={
                proOnly
                  ? 'Rendre public'
                  : 'Rendre accessible aux Pros uniquement'
              }
              onClick={event => {
                event.preventDefault();
                return handleToggleProOnly(Key, proOnly);
              }}
              size="small"
            />
          )}

          {isAllowedToDelete(disabled, status) && (
            <IconButton
              disabled={deleting}
              type={deleting ? 'loop-spin' : 'close'}
              tooltip={<T id="general.delete" />}
              onClick={event => {
                event.preventDefault();
                setDeleting(true);
                openModal({
                  title: <T id="Files.removeFile" />,
                  content: () => (
                    <T id="Files.removeFile.confirm" values={{ name }} />
                  ),
                  actions: ({ closeModal }) => [
                    <Button
                      key="cancel"
                      onClick={() => {
                        setDeleting(false);
                        closeModal();
                      }}
                    >
                      <T id="general.cancel" />
                    </Button>,
                    <Button
                      key="delete"
                      primary
                      raised
                      onClick={() => {
                        handleRemove(Key).catch(error => {
                          // Only stop the loader if deleting fails
                          // This component will be deleted anyways when the deletion worked
                          setDeleting(false);
                          closeModal();
                          throw error;
                        });
                        closeModal();
                      }}
                    >
                      <T id="general.delete" />
                    </Button>,
                  ],
                  important: true,
                });
              }}
              size="small"
            />
          )}
          <Downloader fileKey={Key} fileName={name} size="small" />
        </div>
      </div>
      {message && status === FILE_STATUS.ERROR && (
        <p className="error file-error">
          {message}
          {Meteor.microservice === 'admin' && (
            <IconButton
              disabled={deleting}
              type={deleting ? 'loop-spin' : 'edit'}
              tooltip="Modifier le message d'erreur"
              onClick={event => {
                event.preventDefault();
                openModal(
                  <DialogForm
                    schema={
                      new SimpleSchema({
                        error: { type: String, optional: true },
                      })
                    }
                    model={{ error: message }}
                    title="Modifier l'erreur"
                    description="Entrez le nouveau message d'erreur."
                    className="animated fadeIn"
                    important
                    onSubmit={({ error }) => handleChangeError(error, Key)}
                  />,
                );
              }}
              size="small"
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
