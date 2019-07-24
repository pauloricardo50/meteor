import { Meteor } from 'meteor/meteor';
import fs from 'fs';
import path from 'path';

import RESTAPI from 'core/api/RESTAPI/server/RESTAPI';
import {
  getPropertyLoansAPI,
  getUserAPI,
  interestRatesAPI,
  inviteUserToPromotionAPI,
  inviteCustomerToProPropertiesAPI,
  mortgageEstimateAPI,
  referCustomerAPI,
  testEndpointAPI,
  updatePropertyAPI,
  insertPropertyAPI,
  uploadFileAPI,
} from 'core/api/RESTAPI/server/endpoints/';
import { FILE_UPLOAD_DIR } from 'core/api/RESTAPI/server/restApiConstants';

const api = new RESTAPI();
api.addEndpoint(
  '/promotions/:promotionId/invite-customer',
  'POST',
  inviteUserToPromotionAPI,
);
api.addEndpoint(
  '/properties/invite-customer',
  'POST',
  inviteCustomerToProPropertiesAPI,
);
api.addEndpoint('/properties/:propertyId/loans', 'GET', getPropertyLoansAPI);
api.addEndpoint('/properties/:propertyId', 'POST', updatePropertyAPI);
api.addEndpoint('/users', 'POST', referCustomerAPI);
api.addEndpoint('/users', 'GET', getUserAPI);
api.addEndpoint('/test', 'POST', testEndpointAPI);
api.addEndpoint('/test', 'GET', testEndpointAPI);
api.addEndpoint('/test', 'PUT', testEndpointAPI);
api.addEndpoint('/test', 'DELETE', testEndpointAPI);
api.addEndpoint('/test/:id', 'POST', testEndpointAPI);
api.addEndpoint('/test/:id', 'GET', testEndpointAPI);
api.addEndpoint('/test/:id', 'PUT', testEndpointAPI);
api.addEndpoint('/test/:id', 'DELETE', testEndpointAPI);
api.addEndpoint('/interest-rates/latest', 'GET', interestRatesAPI);
api.addEndpoint('/calculator/mortgage-estimate', 'GET', mortgageEstimateAPI);
api.addEndpoint('/properties', 'POST', insertPropertyAPI);
api.addEndpoint('/upload', 'POST', uploadFileAPI);

const makeFileUploadDir = () => {
  if (!fs.existsSync(FILE_UPLOAD_DIR)) {
    fs.mkdirSync(FILE_UPLOAD_DIR);
  }
};

const flushUploadDir = () => {
  fs.readdir(FILE_UPLOAD_DIR, (error, files) => {
    if (error) {
      throw error;
    }

    [...files].forEach((file) => {
      fs.unlink(path.join(FILE_UPLOAD_DIR, file), (err) => {
        if (err) {
          throw err;
        }
      });
    });
  });
};

Meteor.startup(() => {
  makeFileUploadDir();
  flushUploadDir();
  api.start();
});
