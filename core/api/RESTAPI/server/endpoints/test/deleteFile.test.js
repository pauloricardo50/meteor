/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { expect } from 'chai';
import { appendFileSync } from 'fs';
import { Random } from 'meteor/random';

import {
  PROPERTY_DOCUMENTS,
} from 'core/api/files/fileConstants';
import { makeFileUploadDir, flushFileUploadDir } from 'core/utils/filesUtils';

import PropertyService from 'core/api/properties/server/PropertyService';
import generator from '../../../../factories';
import {
  PROPERTY_CATEGORY,
  PROPERTY_PERMISSIONS_FULL_ACCESS,
} from '../../../../properties/propertyConstants';
import {
  uploadFile,
  fetchAndCheckResponse,
  makeHeaders,
  getTimestampAndNonce,
} from '../../test/apiTestHelpers.test';
import RESTAPI from '../../RESTAPI';
import { uploadFileAPI, deleteFileAPI } from '..';
import { FILE_UPLOAD_DIR, HTTP_STATUS_CODES } from '../../restApiConstants';

const api = new RESTAPI();
let propertyId = '';
api.addEndpoint('/upload', 'POST', uploadFileAPI, { multipart: true });
api.addEndpoint('/deleteFile', 'POST', deleteFileAPI);

const deleteFile = ({ key, propertyId: propId, impersonateUser, userId }) => {
  const { timestamp, nonce } = getTimestampAndNonce();

  const body = { key, propertyId: propId };
  const query = impersonateUser
    ? { 'impersonate-user': impersonateUser }
    : undefined;

  return fetchAndCheckResponse({
    url: '/deleteFile',
    query,
    data: {
      method: 'POST',
      headers: makeHeaders({
        userId,
        timestamp,
        nonce,
        body,
        query,
      }),
      body: JSON.stringify(body),
    },
  });
};

describe('REST: deleteFile', function () {
  this.timeout(10000);

  before(function () {
    if (Meteor.settings.public.microservice !== 'pro') {
      this.parent.pending = true;
      this.skip();
    } else {
      makeFileUploadDir();
      flushFileUploadDir();
      api.start();
    }
  });

  after(() => {
    api.reset();
  });

  beforeEach(() => {
    resetDatabase();
    propertyId = Random.id();
    generator({
      users: [
        {
          _id: 'pro',
          _factory: 'pro',
          organisations: { _id: 'org1' },
          emails: [{ address: 'pro@org.com', verified: true }],
          proProperties: {
            _id: propertyId,
            category: PROPERTY_CATEGORY.PRO,
            externalId: 'extId',
          },
        },
        {
          _id: 'pro2',
          _factory: 'pro',
          organisations: { _id: 'org1' },
          emails: [{ address: 'pro2@org.com', verified: true }],
        },
      ],
    });
  });

  it('deletes a file', () => {
    PropertyService.setProUserPermissions({
      propertyId,
      userId: 'pro',
      permissions: PROPERTY_PERMISSIONS_FULL_ACCESS,
    });
    const filePath = `${FILE_UPLOAD_DIR}/myFile.txt`;
    appendFileSync(filePath, 'Hello');
    return uploadFile({
      filePath,
      userId: 'pro',
      url: '/upload',
      propertyId,
      category: PROPERTY_DOCUMENTS.PROPERTY_PICTURES,
    })
      .then((res) => {
        const { files } = res;
        expect(files.length).to.equal(1);
        return files[0].Key;
      })
      .then(key =>
        deleteFile({ key, propertyId, userId: 'pro' }).then((res) => {
          const { deletedFiles = [] } = res;
          expect(deletedFiles.length).to.equal(1);
          expect(deletedFiles[0].Key).to.equal(key);
        }));
  });

  it('does not allow to delete file when user does not have permissions', () => {
    PropertyService.setProUserPermissions({
      propertyId,
      userId: 'pro',
      permissions: PROPERTY_PERMISSIONS_FULL_ACCESS,
    });
    const filePath = `${FILE_UPLOAD_DIR}/myFile.txt`;
    appendFileSync(filePath, 'Hello');
    return uploadFile({
      filePath,
      userId: 'pro',
      url: '/upload',
      propertyId,
      category: PROPERTY_DOCUMENTS.PROPERTY_PICTURES,
    })
      .then((res) => {
        const { files } = res;
        expect(files.length).to.equal(1);
        return files[0].Key;
      })
      .then((key) => {
        PropertyService.setProUserPermissions({
          propertyId,
          userId: 'pro',
          permissions: { canModifyProperty: false },
        });

        return deleteFile({ key, propertyId, userId: 'pro' }).then((res) => {
          const { status, message } = res;
          expect(status).to.equal(HTTP_STATUS_CODES.FORBIDDEN);
          expect(message).to.include('[NOT_AUTHORIZED]');
        });
      });
  });

  it('works when impersonating', () => {
    PropertyService.setProUserPermissions({
      propertyId,
      userId: 'pro',
      permissions: PROPERTY_PERMISSIONS_FULL_ACCESS,
    });
    const filePath = `${FILE_UPLOAD_DIR}/myFile.txt`;
    appendFileSync(filePath, 'Hello');
    return uploadFile({
      filePath,
      userId: 'pro',
      url: '/upload',
      propertyId,
      category: PROPERTY_DOCUMENTS.PROPERTY_PICTURES,
    })
      .then((res) => {
        const { files } = res;
        expect(files.length).to.equal(1);
        return files[0].Key;
      })
      .then(key =>
        deleteFile({
          key,
          propertyId,
          userId: 'pro2',
          impersonateUser: 'pro@org.com',
        }).then((res) => {
          const { deletedFiles = [] } = res;
          expect(deletedFiles.length).to.equal(1);
          expect(deletedFiles[0].Key).to.equal(key);
        }));
  });

  it('fails with a wrong propertyId', () =>
    deleteFile({
      key: 'wathever',
      propertyId: '12345',
      userId: 'pro',
    }).then((res) => {
      const { status, message } = res;
      expect(status).to.equal(HTTP_STATUS_CODES.NOT_FOUND);
      expect(message).to.include('No property found');
    }));

  it('fails with a wrong key', () => {
    PropertyService.setProUserPermissions({
      propertyId,
      userId: 'pro',
      permissions: PROPERTY_PERMISSIONS_FULL_ACCESS,
    });

    return deleteFile({
      key: 'wathever',
      propertyId,
      userId: 'pro',
    }).then((res) => {
      const { status, message } = res;
      expect(status).to.equal(HTTP_STATUS_CODES.NOT_FOUND);
      expect(message).to.include('not found');
    });
  });

  it('fails when no propertyId is given', () =>
    deleteFile({
      key: 'wathever',
      userId: 'pro',
    }).then((res) => {
      const { status, message } = res;
      expect(status).to.equal(HTTP_STATUS_CODES.BAD_REQUEST);
      expect(message).to.include('Property ID is required');
    }));

  it('works with an external id', () => {
    PropertyService.setProUserPermissions({
      propertyId,
      userId: 'pro',
      permissions: PROPERTY_PERMISSIONS_FULL_ACCESS,
    });
    const filePath = `${FILE_UPLOAD_DIR}/myFile.txt`;
    appendFileSync(filePath, 'Hello');
    return uploadFile({
      filePath,
      userId: 'pro',
      url: '/upload',
      propertyId,
      category: PROPERTY_DOCUMENTS.PROPERTY_PICTURES,
    })
      .then((res) => {
        const { files } = res;
        expect(files.length).to.equal(1);
        return files[0].Key;
      })
      .then(key =>
        deleteFile({ key, propertyId: 'extId', userId: 'pro' }).then((res) => {
          const { deletedFiles = [] } = res;
          expect(deletedFiles.length).to.equal(1);
          expect(deletedFiles[0].Key).to.equal(key);
        }));
  });

  
});
