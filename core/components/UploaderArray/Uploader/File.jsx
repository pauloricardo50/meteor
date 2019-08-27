import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { withState, compose } from 'recompose';

import { ModalManagerContext } from '../../ModalManager';
import { FILE_STATUS, ROLES } from '../../../api/constants';
import { getSignedUrl } from '../../../api/methods';
import { withFileViewerContext } from '../../../containers/FileViewerContext';
import T from '../../Translation';
import IconButton from '../../IconButton';
import Downloader from '../../Downloader';
import FileStatusSetter from './FileStatusSetter';
import Button from '../../Button';

const isAllowedToDelete = (disabled) => {
  const currentUser = Meteor.user();
  const userIsDev = Roles.userIsInRole(currentUser, ROLES.DEV);
  const userIsAdmin = Roles.userIsInRole(currentUser, ROLES.ADMIN);
  const userIsPro = Roles.userIsInRole(currentUser, ROLES.PRO);
  if (userIsDev || userIsAdmin || userIsPro) {
    return true;
  }

  return !disabled;
};

const File = ({
  file: { name, Key, status, message, url },
  disabled,
  handleRemove,
  deleting,
  setDeleting,
  displayFile,
  docId,
  collection,
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
        >
          {Meteor.microservice === 'admin' ? <a>{name}</a> : name}
        </h5>
        <div className="actions flex center">
          <FileStatusSetter
            status={status}
            fileKey={Key}
            docId={docId}
            collection={collection}
          />
          {isAllowedToDelete(disabled) && (
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
        <p className="error">{message}</p>
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
