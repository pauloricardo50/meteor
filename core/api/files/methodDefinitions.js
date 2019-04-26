import { Method } from '../methods/methods';

export const deleteFile = new Method({
  name: 'deleteFile',
  params: {
    collection: String,
    docId: String,
    fileKey: String,
  },
});

export const setFileStatus = new Method({
  name: 'setFileStatus',
  params: {
    fileKey: String,
    newStatus: String,
  },
});

export const setFileError = new Method({
  name: 'setFileError',
  params: {
    error: String,
    fileKey: String,
  },
});

export const downloadFile = new Method({
  name: 'downloadFile',
  params: {
    key: String,
  },
});

export const getSignedUrl = new Method({
  name: 'getSignedUrl',
  params: {
    key: String,
  },
});

export const updateDocumentsCache = new Method({
  name: 'getSignedUrl',
  params: {
    docId: String,
    collection: String,
  },
});
