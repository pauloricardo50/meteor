import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import moment from 'moment';

import { readFileBuffer, removeFile } from 'core/utils/filesUtils';
import { HTTP_STATUS_CODES } from 'core/api/RESTAPI/server/restApiConstants';
import { getSimpleAuthToken } from 'core/api/RESTAPI/server/helpers';
import { FILE_STATUS, S3_ACLS } from '../fileConstants';
import S3Service from './S3Service';
import { getS3FileKey } from './meteor-slingshot-server';

class FileService {
  listFilesForDoc = (docId, subdocument) => {
    const prefix = subdocument ? `${docId}/${subdocument}` : docId;
    return S3Service.listObjectsWithMetadata(prefix).then(results =>
      results.map(this.formatFile));
  };

  listFilesForDocByCategory = (docId, subdocument) =>
    this.listFilesForDoc(docId, subdocument).then(this.groupFilesByCategory);

  setFileStatus = (key, status) => {
    if (status === FILE_STATUS.VALID) {
      return S3Service.updateMetadata(key, { status, message: '' });
    }

    return S3Service.updateMetadata(key, { status });
  };

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

  formatFile = (file) => {
    let fileName = file.name;
    if (!fileName) {
      const keyParts = file.Key.split('/');
      fileName = keyParts[keyParts.length - 1];
    }
    return { ...file, name: fileName };
  };

  uploadFileAPI = ({ file, docId, id, collection }) => {
    const { originalFilename, path } = file;
    const key = getS3FileKey({ name: originalFilename }, { docId, id });

    return S3Service.putObject(
      readFileBuffer(path),
      key,
      {},
      S3_ACLS.PUBLIC_READ_WRITE,
    )
      .then(() => this.updateDocumentsCache({ docId, collection }))
      .then(() => this.listFilesForDoc(docId))
      .then((files) => {
        removeFile(path);
        return { files };
      });
  };

  deleteFileAPI = ({ docId, collection, key }) =>
    this.listFilesForDoc(docId)
      .then((files) => {
        const keyExists = files.map(({ Key }) => Key).some(Key => Key === key);
        if (!keyExists) {
          throw new Meteor.Error(
            HTTP_STATUS_CODES.NOT_FOUND,
            `Key ${key} not found`,
          );
        }

        return S3Service.deleteObject(key);
      })
      .then(() => this.updateDocumentsCache({ docId, collection }))
      .then(() => this.listFilesForDoc(docId))
      .then(files => ({ deletedFiles: [{ Key: key }], remainingFiles: files }));

  getZipLoanUrl = ({ userId, loanId, documents, options }) => {
    const timestamp = moment().unix();
    const token = getSimpleAuthToken({
      userId,
      loanId,
      timestamp,
      documents,
      options,
    });
    const simpleAuthParams = { loanId, userId, timestamp, documents, options, token };

    return `${
      Meteor.settings.public.subdomains.backend
    }/api/zip-loan/?simple-auth-params=${Buffer.from(JSON.stringify(simpleAuthParams)).toString('base64')}`;
  };

  setAdminName = ({ Key, adminName = '' }) =>
    S3Service.updateMetadata(Key, {
      adminname: adminName,
    });

  moveFile = ({
    Key,
    name,
    oldId,
    oldDocId,
    oldCollection,
    newId,
    newDocId,
    newCollection,
  }) => {
    if (
      oldId === newId
      && oldDocId === newDocId
      && oldCollection === newCollection
    ) {
      return;
    }

    const newKey = `${newDocId}/${newId}/${name}`;

    return S3Service.moveObject(Key, newKey)
      .then(() =>
        this.updateDocumentsCache({
          docId: oldDocId,
          collection: oldCollection,
        }))
      .then(() =>
        this.updateDocumentsCache({
          docId: newDocId,
          collection: newCollection,
        }));
  };
}

export default new FileService();
