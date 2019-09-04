import SecurityService from '../../security';
import {
  deleteFile,
  setFileStatus,
  setFileError,
  downloadFile,
  getSignedUrl,
  updateDocumentsCache,
  getZipLoanUrl,
  setFileAdminName,
  moveFile,
} from '../methodDefinitions';
import FileService from './FileService';
import S3Service from './S3Service';
import { FILE_STATUS } from '../fileConstants';

deleteFile.setHandler((context, { collection, docId, fileKey }) => {
  context.unblock();
  SecurityService.isAllowedToModifyFiles({
    collection,
    docId,
    userId: context.userId,
    fileKey,
  });

  return FileService.deleteFile(fileKey).then(() =>
    FileService.updateDocumentsCache({ docId, collection }));
});

setFileStatus.setHandler((context, { fileKey, newStatus }) => {
  context.unblock();
  SecurityService.checkCurrentUserIsAdmin();
  // Should update documents cache when we start using this
  return FileService.setFileStatus(fileKey, newStatus);
});

setFileError.setHandler((context, { fileKey, error }) => {
  context.unblock();
  SecurityService.checkCurrentUserIsAdmin();
  // Should update documents cache when we start using this
  return FileService.setFileError(fileKey, error);
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

updateDocumentsCache.setHandler((context, params) => {
  context.unblock();
  SecurityService.checkLoggedIn();
  return FileService.updateDocumentsCache(params);
});

getZipLoanUrl.setHandler(({ userId }, { loanId, documents, options }) => {
  SecurityService.checkCurrentUserIsAdmin();
  return FileService.getZipLoanUrl({ userId, loanId, documents, options });
});

setFileAdminName.setHandler((context, params) => {
  context.unblock();
  SecurityService.checkCurrentUserIsAdmin();
  return FileService.setAdminName(params);
});

moveFile.setHandler((context, { Key, status, oldCollection, newId, newDocId, newCollection }) => {
  context.unblock();
  const oldDocId = Key.split('/')[0];
  const oldId = Key.split('/')[1];
  const name = Key.split('/')[2];

  SecurityService.isAllowedToModifyFiles({
    collection: oldCollection,
    docId: oldDocId,
    userId: context.userId,
    fileKey: Key,
  });
  SecurityService.isAllowedToModifyFiles({
    collection: newCollection,
    docId: newDocId,
    userId: context.userId,
    fileKey: `${newDocId}/${newId}/${name}`,
  });

  if (
    !SecurityService.isUserAdmin(context.userId)
      && status === FILE_STATUS.VALID
  ) {
    SecurityService.handleUnauthorized('Vous ne pouvez pas déplacer un document vérifié');
  }

  return FileService.moveFile({
    Key,
    name,
    oldId,
    oldDocId,
    oldCollection,
    newId,
    newDocId,
    newCollection,
  });
});
