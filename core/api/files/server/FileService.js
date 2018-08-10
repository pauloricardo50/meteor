import { FILE_STATUS } from '../fileConstants';
import S3Service from './S3Service';

class FileService {
  listFilesForDoc = (docId, subdocument) => {
    const prefix = subdocument ? `${docId}/${subdocument}` : docId;
    return S3Service.listObjects(prefix);
  };

  setFileStatus = (key, nextStatus) =>
    S3Service.updateMetadata(key, { status: nextStatus });

  setFileError = (key, errorMessage) =>
    S3Service.updateMetadata(key, {
      status: FILE_STATUS.ERROR,
      message: errorMessage,
    });

  setFileValid = key =>
    S3Service.updateMetadata(key, { status: FILE_STATUS.VALID, message: '' });

  deleteFileFromDoc = S3Service.deleteObject;

  deleteAllFilesForDoc = (docId, subdocument) => {
    const prefix = subdocument ? `${docId}/${subdocument}` : docId;
    return S3Service.deleteObjectsWithPrefix(prefix);
  };
}

export default new FileService();
