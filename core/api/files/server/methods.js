import SecurityService from '../../security';
import {
  deleteFile,
  setFileStatus,
  setFileError,
  downloadFile,
  getSignedUrl,
} from '../methodDefinitions';
import FileService from './FileService';
import S3Service from './S3Service';

deleteFile.setHandler((context, { collection, docId, fileKey }) => {
  context.unblock();
  if (!SecurityService.currentUserIsAdmin()) {
    SecurityService[collection].isAllowedToUpdate(docId, context.userId);
    S3Service.isAllowedToAccess(fileKey);
  }

  return FileService.deleteFile(fileKey);
});

setFileStatus.setHandler((context, { collection, docId, fileKey, newStatus }) => {
  context.unblock();
  SecurityService[collection].isAllowedToUpdate(docId, context.userId);
  FileService.setFileStatus(fileKey, newStatus);
});

setFileError.setHandler((context, { collection, docId, fileKey, error }) => {
  context.unblock();
  SecurityService[collection].isAllowedToUpdate(docId, context.userId);
  FileService.setFileError(fileKey, error);
});

downloadFile.setHandler((context, { key }) => {
  context.unblock();
  S3Service.isAllowedToAccess(key);
  return S3Service.getObject(key);
});

getSignedUrl.setHandler((context, { key }) => {
  context.unblock();
  SecurityService.checkCurrentUserIsAdmin();
  return S3Service.makeSignedUrl(key);
});
