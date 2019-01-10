import SecurityService from '../../security';
import {
  deleteFile,
  setFileStatus,
  setFileError,
  downloadFile,
} from '../methodDefinitions';
import FileService from './FileService';
import S3Service from './S3Service';

deleteFile.setHandler((context, { collection, docId, fileKey }) => {
  if (!SecurityService.currentUserIsAdmin()) {
    SecurityService[collection].isAllowedToUpdate(docId);
    S3Service.isAllowedToAccess(fileKey);
  }

  return FileService.deleteFile(fileKey);
});

setFileStatus.setHandler((context, { collection, docId, fileKey, newStatus }) => {
  SecurityService[collection].isAllowedToUpdate(docId);
  FileService.setFileStatus(fileKey, newStatus);
});

setFileError.setHandler((context, { collection, docId, fileKey, error }) => {
  SecurityService[collection].isAllowedToUpdate(docId);
  FileService.setFileError(fileKey, error);
});

downloadFile.setHandler((context, { key }) => {
  S3Service.isAllowedToAccess(key);
  return S3Service.getObject(key);
});
