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
  deleteTempFile,
  autoRenameFile,
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
    FileService.updateDocumentsCache({ docId, collection }),
  );
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
  const { userId } = context;
  S3Service.isAllowedToAccess({ userId, key });
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

moveFile.setHandler(
  (context, { Key, status, oldCollection, newId, newDocId, newCollection }) => {
    context.unblock();
    const {
      docId: oldDocId,
      documentId: oldId,
      fileName: name,
    } = FileService.getKeyParts(Key);

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
      !SecurityService.isUserAdmin(context.userId) &&
      status === FILE_STATUS.VALID
    ) {
      SecurityService.handleUnauthorized(
        'Vous ne pouvez pas déplacer un document vérifié',
      );
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
  },
);

deleteTempFile.setHandler(({ userId }, { fileKey }) => {
  SecurityService.isAllowedToRemoveTempFile({ userId, fileKey });
  return FileService.deleteFile(fileKey);
});

autoRenameFile.setHandler(({ userId }, { key, collection }) => {
  S3Service.isAllowedToAccess({ userId, key });
  return FileService.autoRenameFile(key, collection);
});
