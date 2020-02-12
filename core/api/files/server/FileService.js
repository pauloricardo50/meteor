import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import moment from 'moment';

import { readFileBuffer, removeFile } from 'core/utils/filesUtils';
import { HTTP_STATUS_CODES } from 'core/api/RESTAPI/server/restApiConstants';
import { getSimpleAuthToken } from 'core/api/RESTAPI/server/helpers';
import Intl from 'core/utils/server/intl';
import { asyncForEach } from 'core/api/helpers/index';
import { FILE_STATUS, S3_ACLS, FILE_ROLES } from '../fileConstants';
import S3Service from './S3Service';

const formatMessage = Intl.formatMessage.bind(Intl);

class FileService {
  listFilesForDoc = (docId, subdocument) => {
    const prefix = subdocument ? `${docId}/${subdocument}` : docId;
    return S3Service.listObjectsWithMetadata(prefix).then(results =>
      results.map(this.formatFile),
    );
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
      const { documentId: category } = this.getKeyParts(file.Key);
      const currentCategoryFiles = groupedFiles[category] || [];
      return { ...groupedFiles, [category]: [...currentCategoryFiles, file] };
    }, {});

  updateDocumentsCache = ({ docId, collection }) =>
    this.listFilesForDocByCategory(docId).then(documents =>
      Mongo.Collection.get(collection).update(
        { _id: docId },
        { $set: { documents } },
      ),
    );

  formatFile = file => {
    let fileName = file.name;
    if (!fileName) {
      fileName = this.getKeyParts(file.Key).fileName;
    }
    return { ...file, name: fileName };
  };

  uploadFileAPI = ({ file, docId, id, collection, roles = 'public' }) => {
    const { originalFilename, path } = file;
    const key = this.getS3FileKey({ name: originalFilename }, { docId, id });

    return S3Service.putObject(
      readFileBuffer(path),
      key,
      { roles },
      S3_ACLS.PUBLIC_READ,
    )
      .then(() => this.updateDocumentsCache({ docId, collection }))
      .then(() => this.listFilesForDoc(docId))
      .then(files => {
        removeFile(path);
        return { files };
      });
  };

  setFileRoles = ({ Key, roles = [] }) =>
    S3Service.updateMetadata(Key, {
      roles: roles.join(','),
    });

  deleteFileAPI = ({ docId, collection, key }) =>
    this.listFilesForDoc(docId)
      .then(files => {
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
    const simpleAuthParams = {
      loanId,
      userId,
      timestamp,
      documents,
      options,
      token,
    };

    return `${
      Meteor.settings.public.subdomains.api
    }/api/zip-loan/?simple-auth-params=${Buffer.from(
      JSON.stringify(simpleAuthParams),
    ).toString('base64')}`;
  };

  setAdminName = ({ Key, adminName = '' }) =>
    S3Service.updateMetadata(Key, {
      adminname: adminName,
    });

  moveFile = ({
    Key,
    name,
    oldDocId,
    oldCollection,
    newId,
    newDocId,
    newCollection,
  }) => {
    const newKey = `${newDocId}/${newId}/${name}`;

    if (newKey === Key) {
      return;
    }

    return S3Service.moveObject(Key, newKey)
      .then(() =>
        this.updateDocumentsCache({
          docId: newDocId,
          collection: newCollection,
        }),
      )
      .then(() => {
        if (oldDocId && oldCollection) {
          return this.updateDocumentsCache({
            docId: oldDocId,
            collection: oldCollection,
          });
        }
      })
      .then(() => newKey);
  };

  getKeyParts = key => {
    const [docId, documentId, fileName] = key.split('/');
    const extension = fileName && fileName.split('.').slice(-1)[0];
    return { docId, documentId, fileName, extension };
  };

  getFileName = key => key.split('/').slice(-1)[0];

  formatFileName = fileName =>
    fileName.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  getS3FileKey = (file, { docId, id }) =>
    `${docId}/${id}/${this.formatFileName(file.name)}`;

  getTempS3FileKey = (userId, file, { id }) =>
    `temp/${userId}/${id}/${this.formatFileName(file.name)}`;

  getFileFromKey = Key => {
    try {
      return S3Service.headObject(Key);
    } catch (error) {
      return undefined;
    }
  };

  flushTempFiles = async () => {
    const tempFiles = await this.listFilesForDoc('temp');
    const fifteenMinutesAgo = moment(Date.now()).subtract(15, 'minutes');
    const tempFilesToRemove = tempFiles.filter(
      ({ LastModified }) => moment(LastModified) < fifteenMinutesAgo,
    );

    const deletedFiles = await Promise.all(
      tempFilesToRemove.map(({ Key }) => S3Service.deleteObject(Key)),
    );

    return deletedFiles.length;
  };

  autoRenameFile = async (key, collection) => {
    const { docId, documentId } = this.getKeyParts(key);
    const files = (await this.listFilesForDoc(docId, documentId)) || [];
    const keys = files.map(({ Key }) => Key);
    const today = moment().format('YYYY-MM-DD');

    const renameFiles = async () => {
      await asyncForEach(keys, async (Key, index) => {
        const { extension, fileName } = this.getKeyParts(Key);
        const existingDate = fileName.match(/\d{4}-\d{2}-\d{2}/g);
        const date = existingDate ? existingDate[0] : today;
        const documentName = formatMessage({ id: `files.${documentId}` });
        const name =
          keys.length === 1
            ? `${date} ${documentName}.${extension}`
            : `${date} ${documentName} (${index + 1} sur ${
                keys.length
              }).${extension}`;

        await this.moveFile({
          Key,
          name,
          oldId: documentId,
          oldDocId: docId,
          oldCollection: collection,
          newId: documentId,
          newDocId: docId,
          newCollection: collection,
        });
      });
    };

    await renameFiles();
  };
}

export default new FileService();
