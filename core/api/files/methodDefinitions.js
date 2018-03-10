import { Method } from '../methods/methods';

export const addFileToDoc = new Method({
  name: 'addFileToDoc',
  params: {
    file: Object,
    fileId: String,
    collection: String,
    docId: String,
  },
});

export const deleteFileFromDoc = new Method({
  name: 'deleteFileFromDoc',
  params: {
    fileId: String,
    fileKey: String,
    collection: String,
    docId: String,
  },
});
