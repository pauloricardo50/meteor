import { Meteor } from 'meteor/meteor';
import { SecurityService } from '../..';
import {
  addFileToDoc,
  deleteFile,
  setFileStatus,
  setFileError,
} from '../methodDefinitions';
import FileService from '../FileService';
import { setupS3 } from './s3';

addFileToDoc.setHandler((context, { collection, docId, fileId, file }) => {
  SecurityService[collection].isAllowedToUpdate(docId);
  FileService.addFileToDoc({ collection, docId, fileId, file });
});

deleteFile.setHandler((context, { collection, docId, fileId, fileKey }) => {
  SecurityService[collection].isAllowedToUpdate(docId);
  const s3 = setupS3();
  const params = { Bucket: Meteor.settings.S3Bucket, Key: fileKey };

  return s3.deleteObject(params, (err) => {
    if (err) {
      throw new Meteor.Error(err);
    }
    FileService.deleteFileFromDoc({ collection, docId, fileId, fileKey });
  });
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
