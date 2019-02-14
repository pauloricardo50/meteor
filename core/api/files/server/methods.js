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

deleteFile.setHandler(({ userId }, { collection, docId, fileKey }) => {
  context.unblock();
  SecurityService.isAllowedToModifyFiles({
    collection,
    docId,
    userId,
    fileKey,
  });
  // S3Service.isAllowedToAccess(fileKey);

  return FileService.deleteFile(fileKey);
});

setFileStatus.setHandler((context, { fileKey, newStatus }) => {
  context.unblock();
  SecurityService.checkCurrentUserIsAdmin();
  FileService.setFileStatus(fileKey, newStatus);
});

setFileError.setHandler((context, { fileKey, error }) => {
  context.unblock();
  SecurityService.checkCurrentUserIsAdmin();
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
