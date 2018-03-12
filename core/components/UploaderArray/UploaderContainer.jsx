import { createContainer, addFileToDoc, deleteFile } from 'core/api';

export default createContainer(({ collection, docId, fileMeta }) => {
  const additionalProps = {
    addFileToDoc: file =>
      addFileToDoc.run({
        collection,
        docId,
        fileId: fileMeta.id,
        file,
      }),
    deleteFile: fileKey =>
      deleteFile.run({
        collection,
        docId,
        fileId: fileMeta.id,
        fileKey,
      }),
  };

  return additionalProps;
});
