import { Meteor } from 'meteor/meteor';
import { SecurityService } from '../..';
import {
  addFileToDoc,
  deleteFile,
  setFileStatus,
  setFileError,
  downloadFile,
  addDocument,
  removeDocument,
} from '../methodDefinitions';
import FileService from '../FileService';
import { setupS3, isAllowed } from './s3';

addFileToDoc.setHandler((context, { collection, docId, documentId, file }) => {
  SecurityService[collection].isAllowedToUpdate(docId);
  FileService.addFileToDoc({ collection, docId, documentId, file });
});

deleteFile.setHandler((context, { collection, docId, documentId, fileKey }) => {
  SecurityService[collection].isAllowedToUpdate(docId);
  const s3 = setupS3();
  const params = { Bucket: Meteor.settings.S3Bucket, Key: fileKey };

  FileService.deleteFileFromDoc({ collection, docId, documentId, fileKey });

  s3.deleteObject(params, (err, data) => {
    if (err) {
      throw new Meteor.Error(err);
    }
  });
});

setFileStatus.setHandler((context, { collection, docId, documentId, fileKey, newStatus }) => {
  SecurityService[collection].isAllowedToUpdate(docId);
  FileService.setFileStatus({
    collection,
    docId,
    documentId,
    fileKey,
    newStatus,
  });
});

setFileError.setHandler((context, { collection, docId, documentId, fileKey, error }) => {
  SecurityService[collection].isAllowedToUpdate(docId);
  FileService.setFileError({ collection, docId, documentId, fileKey, error });
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

addDocument.setHandler((context, { documentName, loanId }) => {
  SecurityService.checkCurrentUserIsAdmin();
  FileService.addDocument({ documentName, loanId });
});

removeDocument.setHandler((context, { documentId, loanId }) => {
  SecurityService.checkCurrentUserIsAdmin();
  FileService.removeDocument({ documentId, loanId });
});
