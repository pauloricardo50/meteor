import React from 'react';
import { injectIntl } from 'react-intl';
import { compose, withProps } from 'recompose';

import {
  moveFile,
  updateDocumentsCache,
  setFileAdminName,
  setFileError,
  setFileStatus,
  autoRenameFile,
  setFileRoles,
} from 'core/api/methods/index';

import ClientEventService, {
  MODIFIED_FILES_EVENT,
} from '../../../api/events/ClientEventService';
import { SLINGSHOT_DIRECTIVE_NAME } from '../../../api/files/fileConstants';
import { notifyOfUpload } from '../../../api/slack/methodDefinitions';
import withMatchParam from '../../../containers/withMatchParam';
import AdditionalDocModifier from './AdditionalDocModifier';
import {
  addProps,
  checkFile,
  displayFullState,
  tempFileState,
  willReceiveProps,
  withMergedSuccessfulFiles,
} from './uploaderHelpers';

const addMeteorProps = withProps(
  ({
    intl: { formatMessage: f },
    handleSuccess,
    fileMeta: {
      id: fileId,
      label,
      acl,
      maxSize,
      requiredByAdmin,
      category,
      tooltip,
    },
    loanId,
    docId,
    collection,
    canModify,
    autoRenameFiles = false,
    allowSetRoles = false,
  }) => ({
    handleSuccess: async (file, url) => {
      ClientEventService.emit(MODIFIED_FILES_EVENT);
      await notifyOfUpload.run({
        fileName: file.name,
        docLabel: label || f({ id: `files.${fileId}` }),
        loanId,
      });

      await updateDocumentsCache.run({ collection, docId });

      if (autoRenameFiles) {
        await autoRenameFile.run({ key: file.Key, collection });
      }

      if (handleSuccess) {
        handleSuccess(file, url);
      }
    },
    handleMoveFile: destinationFiles => ({
      Key,
      status,
      oldCollection,
      name,
    }) => {
      const isValid = checkFile({ name }, destinationFiles, []);

      if (isValid !== true) {
        import('../../../utils/notification').then(
          ({ default: notification }) => {
            notification.error({
              message: f({ id: `errors.${isValid}.title` }),
              description: f({ id: `errors.${isValid}.description` }),
            });
          },
        );
        return;
      }

      return moveFile.run({
        Key,
        status,
        oldCollection,
        newId: fileId,
        newDocId: docId,
        newCollection: collection,
      });
    },
    uploadDirective: SLINGSHOT_DIRECTIVE_NAME,
    uploadDirectiveProps: { collection, docId, id: fileId, acl, maxSize },
    fileId,
    handleRenameFile: (newName, Key) =>
      setFileAdminName
        .run({ Key, adminName: newName })
        .then(() => updateDocumentsCache.run({ docId, collection })),
    handleChangeError: (error, Key) =>
      setFileError
        .run({ fileKey: Key, error })
        .then(() => updateDocumentsCache.run({ docId, collection })),
    handleChangeFileStatus: (newStatus, Key) =>
      setFileStatus
        .run({ fileKey: Key, newStatus })
        .then(() => updateDocumentsCache.run({ docId, collection })),
    handleSetRoles: (Key, roles = []) =>
      setFileRoles
        .run({ Key, roles, docId, collection })
        .then(() => updateDocumentsCache.run({ docId, collection })),
    draggable: true,
    allowStatusChange: true,
    allowSetRoles,
    dragProps: { collection },
    uploaderTopRight: canModify && (
      <AdditionalDocModifier
        collection={collection}
        docId={docId}
        additionalDoc={{
          id: fileId,
          label,
          requiredByAdmin,
          category,
          tooltip,
        }}
      />
    ),
  }),
);

export default compose(
  injectIntl,
  displayFullState,
  tempFileState,
  withMatchParam('loanId'),
  addMeteorProps,
  addProps,
  willReceiveProps,
  withMergedSuccessfulFiles,
);
