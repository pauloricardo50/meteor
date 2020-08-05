import SecurityService from '../../security';
import { FILE_STATUS } from '../fileConstants';
import {
  deleteFile,
  deleteTempFile,
  downloadFile,
  getSignedUrl,
  getZipLoanUrl,
  handleSuccessfulUpload,
  moveFile,
  setFileAdminName,
  setFileError,
  setFileRoles,
  setFileStatus,
  updateDocumentsCache,
} from '../methodDefinitions';
import FileService from './FileService';
import S3Service from './S3Service';

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
  SecurityService.checkUserIsAdmin(context.userId);
  // Should update documents cache when we start using this
  return FileService.setFileStatus(fileKey, newStatus);
});

setFileError.setHandler((context, { fileKey, error }) => {
  context.unblock();
  SecurityService.checkUserIsAdmin(context.userId);
  // Should update documents cache when we start using this
  return FileService.setFileError(fileKey, error);
});

downloadFile.setHandler((context, { key }) => {
  context.unblock();
  const { userId } = context;
  SecurityService.files.isAllowedToAccess({ userId, key });
  return S3Service.getObject(key);
});

getSignedUrl.setHandler((context, { key }) => {
  context.unblock();
  SecurityService.checkUserIsAdmin(context.userId);
  return S3Service.makeSignedUrl(key);
});

updateDocumentsCache.setHandler((context, params) => {
  context.unblock();
  SecurityService.checkLoggedIn();
  return FileService.updateDocumentsCache(params);
});

getZipLoanUrl.setHandler(({ userId }, { loanId, documents, options }) => {
  SecurityService.checkUserIsAdmin(context.userId);
  return FileService.getZipLoanUrl({ userId, loanId, documents, options });
});

setFileAdminName.setHandler((context, params) => {
  context.unblock();
  SecurityService.checkUserIsAdmin(context.userId);
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

setFileRoles.setHandler(({ userId }, { docId, collection, Key, roles }) => {
  SecurityService.isAllowedToModifyFiles({
    collection,
    docId,
    fileKey: Key,
    userId,
  });
  return FileService.setFileRoles({ Key, roles });
});

handleSuccessfulUpload.setHandler(
  async (context, { docId, collection, autoRenameFiles, fileKey }) => {
    context.unblock();
    SecurityService.checkLoggedIn();

    await FileService.updateDocumentsCache({ docId, collection });

    if (autoRenameFiles) {
      FileService.autoRenameFile(fileKey, collection);
    }
  },
);
