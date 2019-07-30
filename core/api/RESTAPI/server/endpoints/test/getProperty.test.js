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
import PropertyService from '../../../../properties/server/PropertyService';
import generator from '../../../../factories/index';
import RESTAPI from '../../RESTAPI';
import { getPropertyAPI, uploadFileAPI } from '..';
import {
  fetchAndCheckResponse,
  makeHeaders,
  getTimestampAndNonce,
  uploadFile,
} from '../../test/apiTestHelpers.test';
import {
  PROPERTY_CATEGORY,
  PROPERTY_PERMISSIONS_FULL_ACCESS,
} from '../../../../constants';
import { HTTP_STATUS_CODES, FILE_UPLOAD_DIR } from '../../restApiConstants';

const api = new RESTAPI();

api.addEndpoint('/properties/:propertyId', 'GET', getPropertyAPI);
api.addEndpoint('/upload', 'POST', uploadFileAPI, { multipart: true });

let propertyId = '';

const getProperty = ({ id, userId, impersonateUser }) => {
  const { timestamp, nonce } = getTimestampAndNonce();
  const query = impersonateUser && { 'impersonate-user': impersonateUser };
  return fetchAndCheckResponse({
    url: `/properties/${id || propertyId}`,
    query,
    data: {
      method: 'GET',
      headers: makeHeaders({
        userId,
        timestamp,
        nonce,
        query,
      }),
    },
  });
};

describe('REST: getProperty', function () {
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
          _factory: 'pro',
          _id: 'pro',
          organisations: [{ _id: 'org' }],
        },
        {
          _factory: 'pro',
          _id: 'pro2',
          organisations: [{ _id: 'org' }],
          emails: [{ address: 'pro2@org.com', verified: true }],
          proProperties: [
            {
              _id: propertyId,
              externalId: 'extId',
              category: PROPERTY_CATEGORY.PRO,
            },
          ],
        },
      ],
    });
  });

  it('returns property', () => {
    PropertyService.setProUserPermissions({
      propertyId,
      userId: 'pro2',
      permissions: PROPERTY_PERMISSIONS_FULL_ACCESS,
    });
    return getProperty({
      userId: 'pro',
      impersonateUser: 'pro2@org.com',
    }).then(({ property }) => {
      expect(property._id).to.equal(propertyId);
    });
  });

  it('returns property with files', () => {
    PropertyService.setProUserPermissions({
      propertyId,
      userId: 'pro2',
      permissions: PROPERTY_PERMISSIONS_FULL_ACCESS,
    });
    const filePath = `${FILE_UPLOAD_DIR}/myFile.txt`;
    appendFileSync(filePath, 'Hello');
    return uploadFile({
      filePath,
      userId: 'pro',
      url: '/upload',
      query: { 'impersonate-user': 'pro2@org.com' },
      propertyId,
      category: PROPERTY_DOCUMENTS.PROPERTY_PICTURES,
    })
      .then((res) => {
        const { files } = res;
        expect(files.length).to.equal(1);
        expect(files[0].url).to.equal(`${OBJECT_STORAGE_PATH}/${propertyId}/${PROPERTY_DOCUMENTS.PROPERTY_PICTURES}/myFile.txt`);
      })
      .then(() =>
        getProperty({
          userId: 'pro',
          impersonateUser: 'pro2@org.com',
        }))
      .then(({ property }) => {
        const { _id, documents = {} } = property;
        expect(_id).to.equal(propertyId);
        expect(Object.keys(documents).length).to.equal(1);
      });
  });

  it('returns an error if user has no access to property', () => getProperty({
    userId: 'pro',
  }).then(({ message }) => {
    expect(message).to.include("Vous n'avez pas accès");
  }));

  it('fails when property does not exist', () => getProperty({
    userId: 'pro',
    id: '12345'
  }).then(({ message }) => {
    expect(message).to.include("No property found");
  }));
});
