import { createContainer } from 'core/api/containerToolkit';
import { addFileToDoc, deleteFile } from 'core/api/methods';

export default createContainer(({ collection, docId, fileMeta }) => ({
  addFileToDoc: file =>
    addFileToDoc.run({
      file,
      fileId: fileMeta.id,
      collection,
      docId,
    }),
  deleteFile: fileKey =>
    deleteFile.run({
      fileKey,
      fileId: fileMeta.id,
      collection,
      docId,
    }),
}));
