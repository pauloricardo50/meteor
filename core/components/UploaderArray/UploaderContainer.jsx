import {
  createContainer,
  addFileToDoc,
  deleteFile,
  removeDocument,
  SecurityService,
} from 'core/api';

export default createContainer(({ collection, docId, fileMeta: { id, isAdmin }, disabled }) => {
  const userIsAdmin = SecurityService.currentUserIsAdmin();

  let disableUploader = true;

  if (isAdmin) {
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
    documentIsAdmin: isAdmin,
  };

  return additionalProps;
});
