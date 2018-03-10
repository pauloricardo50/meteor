import { Meteor } from 'meteor/meteor';
import { SecurityService } from '../..';
import {
  addFileToDoc,
  deleteFile,
  setFileStatus,
  setFileError,
  downloadFile,
} from '../methodDefinitions';
import FileService from '../FileService';
import { setupS3, isAllowed } from './s3';

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

downloadFile.setHandler((context, { key }) => {
  isAllowed(key);

  const s3 = setupS3();
  const params = { Bucket: Meteor.settings.S3Bucket, Key: key };

  // Don't ask me why this works...
  // https://gist.github.com/rclai/b9331afd2fbabadb0074
  const async = Meteor.wrapAsync((parameters, callback) =>
    s3.getObject(parameters, (error, data) => {
      callback(error, data);
    }));

  return async(params);
});
