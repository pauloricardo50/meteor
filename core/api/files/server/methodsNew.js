import { SecurityService, getDocFromCollection } from '../..';
import {
  addFileToDoc,
  deleteFile,
  setFileStatus,
  setFileError,
} from '../methodDefinitions';
import FileService from '../FileService';

addFileToDoc.setHandler((context, { file, fileId, collection, docId }) => {
  SecurityService[collection].isAllowedToUpdate(docId);
  console.log('hi');
});

deleteFile.setHandler((context, { fileKey, fileId, collection, docId }) => {
  SecurityService[collection].isAllowedToUpdate(docId);
  console.log('yo');
});

setFileStatus.setHandler((context, { collection, docId, fileId, fileKey, newStatus }) => {
  SecurityService[collection].isAllowedToUpdate(docId);
  FileService.setFileStatus({
    collection,
    docId,
    fileId,
    fileKey,
    newStatus,
  });
});

setFileError.setHandler((context, { collection, docId, fileId, fileKey, error }) => {
  SecurityService[collection].isAllowedToUpdate(docId);
  FileService.setFileStatus({ collection, docId, fileId, fileKey, error });
});
