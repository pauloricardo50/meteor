/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { expect } from 'chai';
import { request } from 'http';
import { createReadStream, statSync, appendFileSync } from 'fs';
import path from 'path';
import mime from 'mime-types';

import { PROPERTY_DOCUMENTS } from 'core/api/files/fileConstants';
import generator from '../../../../factories';
import { PROPERTY_CATEGORY } from '../../../../properties/propertyConstants';
import {
  makeHeaders,
  API_PORT,
  getTimestampAndNonce,
} from '../../test/apiTestHelpers.test';
import RESTAPI from '../../RESTAPI';
import uploadFileAPI from '../uploadFile';
import { FILE_UPLOAD_DIR } from '../../restApiConstants';

const FormData = require('form-data');

const api = new RESTAPI();
api.addEndpoint('/upload', 'POST', uploadFileAPI);

const uploadFile = ({ filePath, propertyId, category, userId }) =>
  new Promise((resolve, reject) => {
    const readStream = createReadStream(filePath);
    const form = new FormData();
    form.append('file', readStream);
    form.append('propertId', propertyId);
    form.append('category', category);
    const { timestamp, nonce } = getTimestampAndNonce();

    const req = request(
      {
        host: 'localhost',
        port: API_PORT,
        path: '/api/upload',
        method: 'POST',
        headers: {
          ...makeHeaders({
            timestamp,
            nonce,
            userId,
            body: { propertyId, category },
            isMultipart: true,
            file: {
              name: path.basename(filePath),
              size: statSync(filePath).size,
              type: mime.lookup(filePath),
            },
          }),
          ...form.getHeaders(),
        },
        json: true,
      },
      (res) => {
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => {
          rawData += chunk;
        });
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(rawData);
            console.log(parsedData);
          } catch (e) {
            console.error(e.message);
          }
        });
      },
    );

    form.pipe(req);
  });

describe.skip('REST: uploadFile', function () {
  this.timeout(10000);

  before(function () {
    if (Meteor.settings.public.microservice !== 'pro') {
      this.parent.pending = true;
      this.skip();
    } else {
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
    const filePath = `${FILE_UPLOAD_DIR}/myFile.txt`;
    appendFileSync(filePath, 'Hello');
    uploadFile({
      filePath,
      propertyId: 'prop',
      category: PROPERTY_DOCUMENTS.PROPERTY_PICTURES,
      userId: 'pro',
    }).then((res) => {
      console.log('res', res);
    });
  });
});
