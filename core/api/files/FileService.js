import { Mongo } from 'meteor/mongo';
import { getFileCount } from './fileHelpers';
import { FILE_STATUS } from './fileConstants';

class FileService {
  addFileToDoc = ({ collection, docId, fileId, file }) => {
    const doc = Mongo.Collection.get(collection).findOne(docId);
    const currentValue = this._getCurrentFileValue({ doc, fileId });
    const { fileCount, fileCountString } = getFileCount(currentValue);

    Mongo.Collection.get(collection).update(docId, {
      $push: {
        [`files.${fileId}`]: {
          ...file,
          name: `${fileCountString}${file.name}`,
          status: FILE_STATUS.UNVERIFIED,
          fileCount,
        },
      },
    });
  };

  deleteFileFromDoc = ({ collection, docId, fileId, fileKey }) => {
    const doc = Mongo.Collection.get(collection).findOne(docId);
    const currentValue = this._getCurrentFileValue({ doc, fileId });
    Mongo.Collection.get(collection).update(docId, {
      $set: {
        [`files.${fileId}`]: currentValue.filter(file => file.key !== fileKey),
      },
    });
  };

  updateFile = ({ collection, docId, fileId, fileKey, fileUpdate }) => {
    const doc = Mongo.Collection.get(collection).findOne(docId);
    const currentValue = this._getCurrentFileValue({ doc, fileId });

    return Mongo.Collection.get(collection).update(docId, {
      $set: {
        [`files.${fileId}`]: this._getNewFiles({
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

  _getCurrentFileValue = ({ doc, fileId }) => doc.files[fileId];

  _getNewFiles = ({ currentValue, fileKey, fileUpdate }) => {
    const file = currentValue.find(f => f.key === fileKey);
    const newFile = [
      ...currentValue.filter(f => f.key !== fileKey),
      { ...file, ...fileUpdate },
    ];

    console.log('old file:', file);

    console.log('file update:', fileUpdate);

    console.log('newFile:', newFile);

    // Filter out unchanged files, and merge the fileUpdate with old version
    return newFile;
  };
}

export default new FileService();
