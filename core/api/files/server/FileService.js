import { Mongo } from 'meteor/mongo';

import { FILE_STATUS } from '../fileConstants';
import S3Service from './S3Service';

class FileService {
  listFilesForDoc = (docId, subdocument) => {
    const prefix = subdocument ? `${docId}/${subdocument}` : docId;
    return S3Service.listObjectsWithMetadata(prefix);
  };

  listFilesForDocByCategory = (docId, subdocument) =>
    this.listFilesForDoc(docId, subdocument).then(this.groupFilesByCategory);

  setFileStatus = (key, nextStatus) =>
    S3Service.updateMetadata(key, {
      status: nextStatus,
      message: nextStatus === FILE_STATUS.VALID ? '' : undefined,
    });

  setFileError = (key, errorMessage) =>
    S3Service.updateMetadata(key, {
      status: FILE_STATUS.ERROR,
      message: errorMessage,
    });

  setFileValid = key =>
    S3Service.updateMetadata(key, { status: FILE_STATUS.VALID, message: '' });

  deleteFile = S3Service.deleteObject;

  deleteAllFilesForDoc = (docId, subdocument) => {
    const prefix = subdocument ? `${docId}/${subdocument}` : docId;
    return S3Service.deleteObjectsWithPrefix(prefix);
  };

  groupFilesByCategory = files =>
    files.reduce((groupedFiles, file) => {
      const category = file.Key.split('/')[1];
      const currentCategoryFiles = groupedFiles[category] || [];
      return { ...groupedFiles, [category]: [...currentCategoryFiles, file] };
    }, {});

  updateDocumentsCache = ({ docId, collection }) =>
    this.listFilesForDocByCategory(docId).then(documents =>
      Mongo.Collection.get(collection).update(
        { _id: docId },
        { $set: { documents } },
      ));
}

export default new FileService();
