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

export const setFileStatus = new Method({
  name: 'setFileStatus',
  params: {
    collection: String,
    docId: String,
    fileId: String,
    fileKey: String,
    newStatus: String,
  },
});

export const setFileError = new Method({
  name: 'setFileStatus',
  params: {
    collection: String,
    docId: String,
    fileId: String,
    fileKey: String,
    error: String,
  },
});
