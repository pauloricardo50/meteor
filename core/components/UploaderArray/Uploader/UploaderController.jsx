import React from 'react';
import { useIntl } from 'react-intl';
import { compose, withProps } from 'recompose';

import ClientEventService, {
  MODIFIED_FILES_EVENT,
} from '../../../api/events/ClientEventService';
import {
  ALLOWED_FILE_TYPES,
  ALLOWED_FILE_TYPES_DISPLAYABLE,
  SLINGSHOT_DIRECTIVE_NAME,
  SLINGSHOT_DIRECTIVE_NAME_DISPLAYABLE,
} from '../../../api/files/fileConstants';
import {
  handleSuccessfulUpload,
  moveFile,
  setFileAdminName,
  setFileError,
  setFileRoles,
  setFileStatus,
  updateDocumentsCache,
} from '../../../api/files/methodDefinitions';
import withMatchParam from '../../../containers/withMatchParam';
import AdditionalDocModifier from './AdditionalDocModifier';
import {
  addProps,
  checkFile,
  displayFullState,
  formatMaxFileSize,
  getMaxSize,
  tempFileState,
  willReceiveProps,
  withMergedSuccessfulFiles,
} from './uploaderHelpers';

const addMeteorProps = withProps(
  ({
    handleSuccess,
    fileMeta,
    loanId,
    docId,
    collection,
    canModify,
    autoRenameFiles = false,
    allowSetRoles = false,
    displayableFile = false,
  }) => {
    const {
      id: fileId,
      label,
      acl,
      maxSize,
      requiredByAdmin,
      category,
      tooltip,
      maxSizeOverride,
    } = fileMeta;
    const { formatMessage: f } = useIntl();
    const uploadDirective = displayableFile
      ? maxSizeOverride
        ? SLINGSHOT_DIRECTIVE_NAME
        : SLINGSHOT_DIRECTIVE_NAME_DISPLAYABLE
      : SLINGSHOT_DIRECTIVE_NAME;
    const allowedFileTypes = displayableFile
      ? ALLOWED_FILE_TYPES_DISPLAYABLE
      : ALLOWED_FILE_TYPES;

    return {
      handleSuccess: (file, url) => {
        ClientEventService.emit(MODIFIED_FILES_EVENT, fileMeta);

        handleSuccessfulUpload.run({
          collection,
          docId,
          loanId,
          fileName: file.name,
          fileKey: file.Key,
          fileMeta,
          autoRenameFiles,
        });

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
        const isValid = checkFile({
          file: { name },
          currentValue: destinationFiles,
          tempFiles: [],
          allowedFileTypes,
          displayableFile,
          maxSize,
          maxSizeOverride,
        });

        if (isValid !== true) {
          import('../../../utils/notification').then(
            ({ default: notification }) => {
              notification.error({
                message: f({ id: `errors.${isValid}.title` }),
                description: f(
                  {
                    id: `errors.${isValid}.description`,
                  },
                  {
                    displayableFile,
                    maxSize: formatMaxFileSize(
                      getMaxSize({ displayableFile, maxSize, maxSizeOverride }),
                    ),
                  },
                ),
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
      uploadDirective,
      uploadDirectiveProps: {
        collection,
        docId,
        id: fileId,
        acl,
        maxSize,
        displayableFile,
        allowedFileTypes,
        maxSizeOverride,
      },
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
        setFileRoles.run({ Key, roles, docId, collection }),
      draggable: true,
      allowStatusChange: true,
      allowSetRoles,
      dragProps: { collection },
      uploaderTopRight: canModify && !fileMeta.checklistItemId && (
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
    };
  },
);

export default compose(
  displayFullState,
  tempFileState,
  withMatchParam('loanId'),
  addMeteorProps,
  addProps,
  willReceiveProps,
  withMergedSuccessfulFiles,
);
