import { Method } from '../methods/methods';

export const addFileToDoc = new Method({
  name: 'addFileToDoc',
  params: {
    file: Object,
    documentId: String,
    collection: String,
    docId: String,
    userId: String,
  },
});

export const deleteFile = new Method({
  name: 'deleteFile',
  params: {
    documentId: String,
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
    documentId: String,
    fileKey: String,
    newStatus: String,
  },
});

export const setFileError = new Method({
  name: 'setFileError',
  params: {
    collection: String,
    docId: String,
    documentId: String,
    fileKey: String,
    error: String,
  },
});

export const downloadFile = new Method({
  name: 'downloadFile',
  params: {
    key: String,
  },
});

export const addDocument = new Method({
  name: 'addDocument',
  params: {
    documentName: String,
    loanId: String,
  },
});

export const removeDocument = new Method({
  name: 'removeDocument',
  params: {
    documentId: String,
    loanId: String,
  },
});
