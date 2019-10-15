import { Match } from 'meteor/check';
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
  name: 'updateDocumentsCache',
  params: {
    docId: String,
    collection: String,
  },
});

export const getZipLoanUrl = new Method({
  name: 'getZipLoanUrl',
  params: {
    loanId: String,
    documents: Object,
    options: Object,
  },
});

export const setFileAdminName = new Method({
  name: 'setFileAdminName',
  params: {
    Key: String,
    adminName: Match.Maybe(String),
  },
});

export const moveFile = new Method({
  name: 'moveFile',
  params: {
    Key: String,
    status: String,
    oldCollection: String,
    newId: String,
    newDocId: String,
    newCollection: String,
  },
});

export const deleteTempFile = new Method({
  name: 'deleteTempFile',
  params: {
    fileKey: String,
  },
});

export const autoRenameFile = new Method({
  name: 'autoRenameFile',
  params: {
    key: String,
    collection: String,
  },
});
