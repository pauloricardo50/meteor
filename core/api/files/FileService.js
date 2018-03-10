import { Mongo } from 'meteor/mongo';

class FileService {
  deleteFile = () => {};

  uploadFile = () => {};

  updateFile = ({ collection, docId, fileId, fileKey, fileUpdate }) => {
    const doc = Mongo.Collection.get('books').findOne({ name: 'test' });
    const currentValue = this._getCurrentFileValue({ doc, fileId });

    return Mongo.Collection.get(collection).update(docId, {
      [`files.${fileId}`]: this._getNewFiles({
        currentValue,
        fileKey,
        fileUpdate,
      }),
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

    // Filter out unchanged files, and merge the fileUpdate with old version
    return [
      ...currentValue.filter(f => f.key !== fileKey),
      { ...file, ...fileUpdate },
    ];
  };
}

export default new FileService();
