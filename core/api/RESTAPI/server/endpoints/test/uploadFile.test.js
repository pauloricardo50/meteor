/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { expect } from 'chai';
import { appendFileSync } from 'fs';

import {
  PROPERTY_DOCUMENTS,
  OBJECT_STORAGE_PATH,
} from 'core/api/files/fileConstants';
import { makeFileUploadDir, flushFileUploadDir } from 'core/utils/filesUtils';

import PropertyService from 'core/api/properties/server/PropertyService';
import generator from '../../../../factories';
import {
  PROPERTY_CATEGORY,
  PROPERTY_PERMISSIONS_FULL_ACCESS,
} from '../../../../properties/propertyConstants';
import { uploadFile } from '../../test/apiTestHelpers.test';
import RESTAPI from '../../RESTAPI';
import { uploadFileAPI } from '..';
import { FILE_UPLOAD_DIR } from '../../restApiConstants';

const api = new RESTAPI();
api.addEndpoint('/upload', 'POST', uploadFileAPI, { multipart: true });

describe('REST: uploadFile', function () {
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
    generator({
      users: {
        _id: 'pro',
        _factory: 'pro',
        organisations: { _id: 'org1' },
        emails: [{ address: 'pro@org.com', verified: true }],
        proProperties: {
          _id: 'prop',
          category: PROPERTY_CATEGORY.PRO,
        },
      },
    });
  });

  it('uploads a file', () => {
    PropertyService.setProUserPermissions({
      propertyId: 'prop',
      userId: 'pro',
      permissions: PROPERTY_PERMISSIONS_FULL_ACCESS,
    });
    const filePath = `${FILE_UPLOAD_DIR}/myFile.txt`;
    appendFileSync(filePath, 'Hello');
    return uploadFile({
      filePath,
      userId: 'pro',
      url: '/upload',
      propertyId: 'prop',
      category: PROPERTY_DOCUMENTS.PROPERTY_PICTURES,
    }).then((res) => {
      const { url } = res;
      expect(url).to.equal(`${OBJECT_STORAGE_PATH}/prop/${PROPERTY_DOCUMENTS.PROPERTY_PICTURES}/myFile.txt`);
    });
  });
});
