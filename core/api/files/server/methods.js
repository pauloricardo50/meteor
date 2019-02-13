import SecurityService from '../../security';
import {
  deleteFile,
  setFileStatus,
  setFileError,
  downloadFile,
} from '../methodDefinitions';
import FileService from './FileService';
import S3Service from './S3Service';

deleteFile.setHandler(({ userId }, { collection, docId, fileKey }) => {
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
  SecurityService.checkCurrentUserIsAdmin();
  FileService.setFileStatus(fileKey, newStatus);
});

setFileError.setHandler((context, { fileKey, error }) => {
  SecurityService.checkCurrentUserIsAdmin();
  FileService.setFileError(fileKey, error);
});

downloadFile.setHandler((context, { key }) => {
  S3Service.isAllowedToAccess(key);
  return S3Service.getObject(key);
});
