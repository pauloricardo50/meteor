import { SecurityService } from '../..';
import {
  addFileToDoc,
  deleteFile,
  setFileStatus,
  setFileError,
  downloadFile,
  addDocument,
  removeDocument,
} from '../methodDefinitions';
import FileService from '../FileService';
import S3Service from './S3Service';

addFileToDoc.setHandler((context, { collection, docId, documentId, file }) => {
  SecurityService[collection].isAllowedToUpdate(docId);
  const userIsAdmin = SecurityService.currentUserIsAdmin();
  FileService.addFileToDoc({
    collection,
    docId,
    documentId,
    file,
    userIsAdmin,
  });
});

deleteFile.setHandler((context, { collection, docId, documentId, fileKey }) => {
  SecurityService[collection].isAllowedToUpdate(docId);
  S3Service.isAllowedToAccess(fileKey);

  FileService.deleteFileFromDoc({ collection, docId, documentId, fileKey });

  return S3Service.deleteObject(fileKey);
});

setFileStatus.setHandler((context, { collection, docId, documentId, fileKey, newStatus }) => {
  SecurityService[collection].isAllowedToUpdate(docId);
  FileService.setFileStatus({
    collection,
    docId,
    documentId,
    fileKey,
    newStatus,
  });
});

setFileError.setHandler((context, { collection, docId, documentId, fileKey, error }) => {
  SecurityService[collection].isAllowedToUpdate(docId);
  FileService.setFileError({ collection, docId, documentId, fileKey, error });
});

downloadFile.setHandler((context, { key }) => {
  S3Service.isAllowedToAccess(key);
  return S3Service.getObject(key);
});

addDocument.setHandler((context, { documentName, loanId }) => {
  SecurityService.checkCurrentUserIsAdmin();
  FileService.addDocument({ documentName, loanId });
});

removeDocument.setHandler((context, { documentId, loanId }) => {
  SecurityService.checkCurrentUserIsAdmin();
  FileService.removeDocument({ documentId, loanId });
});
