import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Random } from 'meteor/random';

import { FileSchema, DocumentSchema } from './documents';
import { getUploadCountPrefix } from './fileHelpers';
import { FILE_STATUS } from './fileConstants';
import { LOANS_COLLECTION } from '../constants';

class FileService {
  addFileToDoc = ({ collection, docId, documentId, file }) => {
    const doc = Mongo.Collection.get(collection).findOne(docId);
    const { uploadCount } = this._getCurrentFileValue({ doc, documentId });
    const uploadCountPrefix = getUploadCountPrefix(uploadCount);
    const newFile = {
      ...file,
      name: `${uploadCountPrefix}${file.initialName}`,
      status: FILE_STATUS.UNVERIFIED,
    };

    // Make sure file is valid, as this is all in a blackbox object
    FileSchema.validate(newFile);

    return Mongo.Collection.get(collection).update(docId, {
      $push: {
        [`documents.${documentId}.files`]: newFile,
      },
      $inc: { [`documents.${documentId}.uploadCount`]: 1 },
    });
  };

  deleteFileFromDoc = ({ collection, docId, documentId, fileKey }) => {
    const doc = Mongo.Collection.get(collection).findOne(docId);
    const { files: currentValue } = this._getCurrentFileValue({
      doc,
      documentId,
    });
    return Mongo.Collection.get(collection).update(docId, {
      $set: {
        [`documents.${documentId}.files`]: currentValue.filter(file => file.key !== fileKey),
      },
    });
  };

  updateFile = ({ collection, docId, documentId, fileKey, fileUpdate }) => {
    const doc = Mongo.Collection.get(collection).findOne(docId);
    const { files: currentValue } = this._getCurrentFileValue({
      doc,
      documentId,
    });

    return Mongo.Collection.get(collection).update(docId, {
      $set: {
        [`documents.${documentId}.files`]: this._getNewFiles({
          currentValue,
          fileKey,
          fileUpdate,
        }),
      },
    });
  };

  setFileStatus = ({ collection, docId, fileId, fileKey, newStatus }) => {
    const fileUpdate = { status: newStatus };
    return this.updateFile({
      collection,
      docId,
      fileId,
      fileKey,
      fileUpdate,
    });
  };

  setFileError = ({ collection, docId, fileId, fileKey, error }) => {
    const fileUpdate = { error };
    return this.updateFile({
      collection,
      docId,
      fileId,
      fileKey,
      fileUpdate,
    });
  };

  _getCurrentFileValue = ({ doc, documentId }) => doc.documents[documentId];

  _getNewFiles = ({ currentValue, fileKey, fileUpdate }) => {
    const file = currentValue.find(f => f.key === fileKey);
    const newFiles = [
      ...currentValue.filter(f => f.key !== fileKey),
      { ...file, ...fileUpdate },
    ];

    // Filter out unchanged files, and merge the fileUpdate with old version
    return newFiles;
  };

  addDocument = ({ documentName, loanId }) => {
    const randomId = Random.id();

    const newDocument = {
      label: documentName,
      files: [],
      isAdmin: true,
      fileCount: 0,
    };

    DocumentSchema.validate(newDocument);

    return Mongo.Collection.get(LOANS_COLLECTION).update(loanId, {
      $set: { [`documents.${randomId}`]: newDocument },
    });
  };

  // TODO: This should also loop over the documents in it and delete them
  // from S3
  removeDocument = ({ documentId, loanId }) => {
    const doc = Mongo.Collection.get(LOANS_COLLECTION).findOne(loanId);
    const document = this._getCurrentFileValue({ doc, documentId });

    if (!document.isAdmin) {
      throw new Meteor.Error('document is not an admin document');
    }

    return Mongo.Collection.get(LOANS_COLLECTION).update(loanId, {
      $unset: { [`documents.${documentId}`]: '' },
    });
  };
}

export default new FileService();
