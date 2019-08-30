import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import Tooltip from '@material-ui/core/Tooltip';

import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { withState, compose } from 'recompose';
import SimpleSchema from 'simpl-schema';

import DialogForm from 'core/components/ModalManager/DialogForm';
import {
  setFileAdminName,
  updateDocumentsCache,
  setFileError,
} from 'core/api/methods/index';
import { ModalManagerContext } from '../../ModalManager';
import { FILE_STATUS, ROLES } from '../../../api/constants';
import { getSignedUrl } from '../../../api/methods';
import { withFileViewerContext } from '../../../containers/FileViewerContext';
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

const makeOnDragStart = ({ Key, status, collection }) => (event) => {
  event.dataTransfer.setData('move', true);
  event.dataTransfer.setData('Key', Key);
  event.dataTransfer.setData('status', status);
  event.dataTransfer.setData('collection', collection);
};

const File = ({
  file: { name, Key, status, message, url, adminname: adminName },
  disabled,
  handleRemove,
  deleting,
  setDeleting,
  displayFile,
  docId,
  collection,
  id,
}) => {
  const { openModal } = useContext(ModalManagerContext);

  return (
    <div className="flex-col">
      <div className="file">
        <h5
          className="secondary bold file-name"
          onClick={(event) => {
            if (Meteor.microservice === 'admin') {
              event.preventDefault();
              getSignedUrl.run({ key: Key }).then((signedUrl) => {
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
          draggable
          onDragStart={makeOnDragStart({ Key, collection, status })}
        >
          {getDisplayName(name, adminName)}
        </h5>
        <div className="actions flex center">
          <FileStatusSetter
            status={status}
            fileKey={Key}
            docId={docId}
            collection={collection}
            error={message}
          />
          {Meteor.microservice === 'admin' && (
            <IconButton
              disabled={deleting}
              type={deleting ? 'loop-spin' : 'edit'}
              tooltip="<ADMIN> Renommer le fichier"
              onClick={(event) => {
                event.preventDefault();
                openModal(<DialogForm
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
                  onSubmit={closeModal => ({ adminName: newName }) => {
                    setFileAdminName
                      .run({ Key, adminName: newName })
                      .then(() =>
                        updateDocumentsCache.run({ docId, collection }))
                      .then(() => closeModal());
                  }}
                />);
              }}
            />
          )}

          {isAllowedToDelete(disabled, status) && (
            <IconButton
              disabled={deleting}
              type={deleting ? 'loop-spin' : 'close'}
              tooltip={<T id="general.delete" />}
              onClick={(event) => {
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
                        handleRemove(Key).catch((error) => {
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
            />
          )}
          <Downloader fileKey={Key} fileName={name} />
        </div>
      </div>
      {message && status === FILE_STATUS.ERROR && (
        <p className="error">
          {message}
          {Meteor.microservice === 'admin' && (
            <IconButton
              disabled={deleting}
              type={deleting ? 'loop-spin' : 'edit'}
              tooltip="Modifier le message d'erreur"
              onClick={(event) => {
                event.preventDefault();
                openModal(<DialogForm
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
                  onSubmit={closeModal => ({ error }) => {
                    setFileError
                      .run({ fileKey: Key, error })
                      .then(() =>
                        updateDocumentsCache.run({ docId, collection }))
                      .then(() => closeModal());
                  }}
                />);
              }}
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

export default compose(
  withState('deleting', 'setDeleting', false),
  withFileViewerContext,
)(File);
