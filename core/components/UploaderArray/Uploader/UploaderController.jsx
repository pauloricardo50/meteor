import React from 'react';
import { compose, withProps } from 'recompose';
import { injectIntl } from 'react-intl';

import {
  moveFile,
  updateDocumentsCache,
  setFileAdminName,
  setFileError,
  setFileStatus,
} from 'core/api/methods/index';
import { SLINGSHOT_DIRECTIVE_NAME } from '../../../api/constants';
import ClientEventService, {
  MODIFIED_FILES_EVENT,
} from '../../../api/events/ClientEventService';
import { notifyOfUpload } from '../../../api/slack/methodDefinitions';
import withMatchParam from '../../../containers/withMatchParam';
import {
  tempFileState,
  addProps,
  willReceiveProps,
  withMergedSuccessfulFiles,
  displayFullState,
} from './uploaderHelpers';
import AdditionalDocModifier from './AdditionalDocModifier';

const addMeteorProps = withProps(({
  intl: { formatMessage: f },
  handleSuccess,
  fileMeta: { id: fileId, label, acl, maxSize, requiredByAdmin, category },
  loanId,
  docId,
  collection,
  canModify,
}) => ({
  handleSuccess: (file, url) => {
    ClientEventService.emit(MODIFIED_FILES_EVENT);
    notifyOfUpload.run({
      fileName: file.name,
      docLabel: label || f({ id: `files.${fileId}` }),
      loanId,
    });
    updateDocumentsCache.run({ collection, docId });
    if (handleSuccess) {
      handleSuccess(file, url);
    }
  },
  handleMoveFile: ({ Key, status, oldCollection }) =>
    moveFile.run({
      Key,
      status,
      oldCollection,
      newId: fileId,
      newDocId: docId,
      newCollection: collection,
    }),
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
  draggable: true,
  allowStatusChange: true,
  dragProps: { collection },
  uploaderTopRight: canModify && (
    <AdditionalDocModifier
      collection={collection}
      docId={docId}
      additionalDoc={{ id: fileId, label, requiredByAdmin, category }}
    />
  ),
}));

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
