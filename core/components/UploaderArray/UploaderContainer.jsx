import { createContainer } from 'core/api/containerToolkit';
import { addFileToDoc, deleteFile } from 'core/api/methods';

export default createContainer(({ collection, docId, fileMeta }) => ({
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
}));
