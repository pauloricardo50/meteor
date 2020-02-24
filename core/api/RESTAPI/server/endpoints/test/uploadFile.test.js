/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { expect } from 'chai';
import { appendFileSync } from 'fs';
import { Random } from 'meteor/random';

import {
  PROPERTY_DOCUMENTS,
  OBJECT_STORAGE_PATH,
} from 'core/api/files/fileConstants';
import { makeFileUploadDir, flushFileUploadDir } from 'core/utils/filesUtils';

import PropertyService from 'core/api/properties/server/PropertyService';
import generator from '../../../../factories/server';
import {
  PROPERTY_CATEGORY,
  PROPERTY_PERMISSIONS_FULL_ACCESS,
} from '../../../../properties/propertyConstants';
import { uploadFile } from '../../test/apiTestHelpers.test';
import RESTAPI from '../../RESTAPI';
import { uploadFileAPI } from '..';
import { FILE_UPLOAD_DIR, HTTP_STATUS_CODES } from '../../restApiConstants';

const api = new RESTAPI();
let propertyId = '';
api.addEndpoint('/files', 'POST', uploadFileAPI, {
  multipart: true,
  endpointName: 'Upload file',
  analyticsParams: req => {
    const { files: { file = {} } = {} } = req;
    return { fileSize: file.size };
  },
});

describe('REST: uploadFile', function() {
  this.timeout(10000);

  before(function() {
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

  it('uploads a file', async () => {
    PropertyService.setProUserPermissions({
      propertyId,
      userId: 'pro',
      permissions: PROPERTY_PERMISSIONS_FULL_ACCESS,
    });
    const filePath = `${FILE_UPLOAD_DIR}/myFile.txt`;
    appendFileSync(filePath, 'Hello');
    const { files } = await uploadFile({
      filePath,
      userId: 'pro',
      url: '/files',
      propertyId,
      category: PROPERTY_DOCUMENTS.PROPERTY_PICTURES,
    });

    expect(files.length).to.equal(1);
    expect(files[0].url).to.equal(
      `${OBJECT_STORAGE_PATH}/${propertyId}/${PROPERTY_DOCUMENTS.PROPERTY_PICTURES}/myFile.txt`,
    );
    expect(files[0].roles).to.equal('public');
  });

  it('uploads a file with roles', async () => {
    PropertyService.setProUserPermissions({
      propertyId,
      userId: 'pro',
      permissions: PROPERTY_PERMISSIONS_FULL_ACCESS,
    });
    const filePath = `${FILE_UPLOAD_DIR}/myFile.txt`;
    appendFileSync(filePath, 'Hello');
    const { files } = await uploadFile({
      filePath,
      userId: 'pro',
      url: '/files',
      propertyId,
      category: PROPERTY_DOCUMENTS.PROPERTY_PICTURES,
      roles: 'pro,admin',
    });
    expect(files.length).to.equal(1);
    expect(files[0].url).to.equal(
      `${OBJECT_STORAGE_PATH}/${propertyId}/${PROPERTY_DOCUMENTS.PROPERTY_PICTURES}/myFile.txt`,
    );
    expect(files[0].roles).to.equal('pro,admin');
  });

  it('returns an error if any role is invalid', async () => {
    PropertyService.setProUserPermissions({
      propertyId,
      userId: 'pro',
      permissions: PROPERTY_PERMISSIONS_FULL_ACCESS,
    });
    const filePath = `${FILE_UPLOAD_DIR}/myFile.txt`;
    appendFileSync(filePath, 'Hello');
    const { message, status } = await uploadFile({
      filePath,
      userId: 'pro',
      url: '/files',
      propertyId,
      category: PROPERTY_DOCUMENTS.PROPERTY_PICTURES,
      roles: 'pro,admin,test',
    });
    expect(status).to.equal(HTTP_STATUS_CODES.BAD_REQUEST);
    expect(message).to.include('"test" is invalid');
  });

  it('uploads two files', async () => {
    PropertyService.setProUserPermissions({
      propertyId,
      userId: 'pro',
      permissions: PROPERTY_PERMISSIONS_FULL_ACCESS,
    });
    const filePath1 = `${FILE_UPLOAD_DIR}/myFile1.txt`;
    const filePath2 = `${FILE_UPLOAD_DIR}/myFile2.txt`;
    appendFileSync(filePath1, 'Hello');
    appendFileSync(filePath2, 'Hello');
    await uploadFile({
      filePath: filePath1,
      userId: 'pro',
      url: '/files',
      propertyId,
      category: PROPERTY_DOCUMENTS.PROPERTY_PICTURES,
    });

    const { files } = await uploadFile({
      filePath: filePath2,
      userId: 'pro',
      url: '/files',
      propertyId,
      category: PROPERTY_DOCUMENTS.PROPERTY_PLANS,
    });
    expect(files.length).to.equal(2);
    expect(files[0].url).to.equal(
      `${OBJECT_STORAGE_PATH}/${propertyId}/${PROPERTY_DOCUMENTS.PROPERTY_PICTURES}/myFile1.txt`,
    );
    expect(files[1].url).to.equal(
      `${OBJECT_STORAGE_PATH}/${propertyId}/${PROPERTY_DOCUMENTS.PROPERTY_PLANS}/myFile2.txt`,
    );
  });

  it('does not allow to upload file when user does not have permissions', async () => {
    const filePath = `${FILE_UPLOAD_DIR}/myFile.txt`;
    appendFileSync(filePath, 'Hello');
    const { status, message } = await uploadFile({
      filePath,
      userId: 'pro2',
      url: '/files',
      propertyId,
      category: PROPERTY_DOCUMENTS.PROPERTY_PICTURES,
    });
    expect(status).to.equal(HTTP_STATUS_CODES.FORBIDDEN);
    expect(message).to.include('[NOT_AUTHORIZED]');
  });

  it('works when impersonating', async () => {
    PropertyService.setProUserPermissions({
      propertyId,
      userId: 'pro',
      permissions: PROPERTY_PERMISSIONS_FULL_ACCESS,
    });
    const filePath = `${FILE_UPLOAD_DIR}/myFile.txt`;
    appendFileSync(filePath, 'Hello');
    const { files } = await uploadFile({
      filePath,
      userId: 'pro2',
      url: '/files',
      query: { 'impersonate-user': 'pro@org.com' },
      propertyId,
      category: PROPERTY_DOCUMENTS.PROPERTY_PICTURES,
    });
    expect(files.length).to.equal(1);
    expect(files[0].url).to.equal(
      `${OBJECT_STORAGE_PATH}/${propertyId}/${PROPERTY_DOCUMENTS.PROPERTY_PICTURES}/myFile.txt`,
    );
  });

  it('fails with a wrong propertyId', async () => {
    const filePath = `${FILE_UPLOAD_DIR}/myFile.txt`;
    appendFileSync(filePath, 'Hello');
    const { status, message } = await uploadFile({
      filePath,
      userId: 'pro2',
      url: '/files',
      propertyId: 'property',
      category: PROPERTY_DOCUMENTS.PROPERTY_PICTURES,
    });
    expect(status).to.equal(HTTP_STATUS_CODES.NOT_FOUND);
    expect(message).to.include('No property found');
  });

  it('fails when no propertyId is given', async () => {
    const filePath = `${FILE_UPLOAD_DIR}/myFile.txt`;
    appendFileSync(filePath, 'Hello');
    const { status, message } = await uploadFile({
      filePath,
      userId: 'pro2',
      url: '/files',
      category: PROPERTY_DOCUMENTS.PROPERTY_PICTURES,
    });
    expect(status).to.equal(HTTP_STATUS_CODES.BAD_REQUEST);
    expect(message).to.include('Property ID is required');
  });

  it('fails when category is wrong', async () => {
    const filePath = `${FILE_UPLOAD_DIR}/myFile.txt`;
    appendFileSync(filePath, 'Hello');
    const { status, message } = await uploadFile({
      filePath,
      userId: 'pro2',
      url: '/files',
      propertyId,
      category: 'wrong',
    });
    expect(status).to.equal(HTTP_STATUS_CODES.BAD_REQUEST);
    expect(message).to.include('wrong is not an allowed value');
  });

  it('works with an external id', async () => {
    PropertyService.setProUserPermissions({
      propertyId,
      userId: 'pro',
      permissions: PROPERTY_PERMISSIONS_FULL_ACCESS,
    });
    const filePath = `${FILE_UPLOAD_DIR}/myFile.txt`;
    appendFileSync(filePath, 'Hello');
    const { files } = await uploadFile({
      filePath,
      userId: 'pro',
      url: '/files',
      propertyId: 'extId',
      category: PROPERTY_DOCUMENTS.PROPERTY_PICTURES,
    });
    expect(files.length).to.equal(1);
    expect(files[0].url).to.equal(
      `${OBJECT_STORAGE_PATH}/${propertyId}/${PROPERTY_DOCUMENTS.PROPERTY_PICTURES}/myFile.txt`,
    );
  });
});
