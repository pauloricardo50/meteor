import { Meteor } from 'meteor/meteor';
import { compose } from 'recompose';

import {
  createContainer,
  addFileToDoc,
  deleteFile,
  removeDocument,
  SecurityService,
} from 'core/api';
import UploaderController from './UploaderController';

const UploaderContainer = createContainer(({ collection, docId, fileMeta: { id, isOwnedByAdmin }, disabled }) => {
  const userIsAdmin = SecurityService.currentUserIsAdmin();

  let disableUploader = true;

  if (isOwnedByAdmin) {
    disableUploader = true;
  } else {
    disableUploader = disabled;
  }

  const additionalProps = {
    addFileToDoc: file =>
      addFileToDoc.run({
        collection,
        docId,
        documentId: id,
        file,
        userId: Meteor.userId(),
      }),
    deleteFile: fileKey =>
      deleteFile.run({
        collection,
        docId,
        documentId: id,
        fileKey,
      }),
    removeDocument: () =>
      removeDocument.run({ documentId: id, loanId: docId }),
    userIsAdmin,
    disabled: userIsAdmin ? false : disableUploader,
    isOwnedByAdmin,
  };

  return additionalProps;
});

export default compose(
  UploaderContainer,
  UploaderController,
);
