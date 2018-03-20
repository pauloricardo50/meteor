import {
  createContainer,
  addFileToDoc,
  deleteFile,
  removeDocument,
  SecurityService,
} from 'core/api';

export default createContainer(({ collection, docId, fileMeta }) => {
  const additionalProps = {
    addFileToDoc: file =>
      addFileToDoc.run({
        collection,
        docId,
        documentId: fileMeta.id,
        file,
      }),
    deleteFile: fileKey =>
      deleteFile.run({
        collection,
        docId,
        documentId: fileMeta.id,
        fileKey,
      }),
    removeDocument: () =>
      removeDocument.run({ documentId: fileMeta.id, loanId: docId }),
    isAdmin: SecurityService.currentUserIsAdmin(),
  };

  return additionalProps;
});
