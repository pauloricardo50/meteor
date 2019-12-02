import { Meteor } from 'meteor/meteor';

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
  deleteFileAPI,
  getPropertyAPI,
  zipLoanAPI,
  setPropertyUserPermissionsAPI,
  addProUserToPropertyAPI,
} from 'core/api/RESTAPI/server/endpoints/';
import { makeFileUploadDir, flushFileUploadDir } from 'core/utils/filesUtils';

const api = new RESTAPI();
api.addEndpoint(
  '/promotions/:promotionId/invite-customer',
  'POST',
  inviteUserToPromotionAPI,
  { rsaAuth: true, endpointName: 'Invite customer to promotion' },
);
api.addEndpoint(
  '/properties/invite-customer',
  'POST',
  inviteCustomerToProPropertiesAPI,
  { rsaAuth: true, endpointName: 'Invite customer to property' },
);
api.addEndpoint('/properties/:propertyId/loans', 'GET', getPropertyLoansAPI, {
  rsaAuth: true,
  endpointName: 'Get property loans',
});
api.addEndpoint('/properties/:propertyId', 'POST', updatePropertyAPI, {
  rsaAuth: true,
  endpointName: 'Update property',
});
api.addEndpoint('/users', 'POST', referCustomerAPI, {
  rsaAuth: true,
  endpointName: 'Refer customer',
});
api.addEndpoint('/users', 'GET', getUserAPI, {
  rsaAuth: true,
  endpointName: 'Get user',
});
api.addEndpoint('/test', 'POST', testEndpointAPI, {
  rsaAuth: true,
  basicAuth: true,
  endpointName: 'Test POST',
});
api.addEndpoint('/test', 'GET', testEndpointAPI, {
  rsaAuth: true,
  basicAuth: true,
  endpointName: 'Test GET',
});
api.addEndpoint('/test', 'PUT', testEndpointAPI, {
  rsaAuth: true,
  basicAuth: true,
  endpointName: 'Test PUT',
});
api.addEndpoint('/test', 'DELETE', testEndpointAPI, {
  rsaAuth: true,
  basicAuth: true,
  endpointName: 'Test DELETE',
});
api.addEndpoint('/test/:id', 'POST', testEndpointAPI, {
  rsaAuth: true,
  basicAuth: true,
  endpointName: 'Test POST with id',
});
api.addEndpoint('/test/:id', 'GET', testEndpointAPI, {
  rsaAuth: true,
  basicAuth: true,
  endpointName: 'Test GET with id',
});
api.addEndpoint('/test/:id', 'PUT', testEndpointAPI, {
  rsaAuth: true,
  basicAuth: true,
  endpointName: 'Test PUT with id',
});
api.addEndpoint('/test/:id', 'DELETE', testEndpointAPI, {
  rsaAuth: true,
  basicAuth: true,
  endpointName: 'Test DELETE with id',
});
api.addEndpoint('/interest-rates/latest', 'GET', interestRatesAPI, {
  rsaAuth: true,
  basicAuth: true,
  endpointName: 'Get interest rates',
});
api.addEndpoint('/calculator/mortgage-estimate', 'GET', mortgageEstimateAPI, {
  rsaAuth: true,
  basicAuth: true,
  endpointName: 'Mortgage estimate',
});
api.addEndpoint('/properties', 'POST', insertPropertyAPI, {
  rsaAuth: true,
  endpointName: 'Insert property',
});
api.addEndpoint('/files', 'POST', uploadFileAPI, {
  multipart: true,
  endpointName: 'Upload file',
});
api.addEndpoint('/files', 'DELETE', deleteFileAPI, {
  rsaAuth: true,
  endpointName: 'Delete file',
});
api.addEndpoint('/properties/:propertyId', 'GET', getPropertyAPI, {
  rsaAuth: true,
  endpointName: 'Get property',
});

api.addEndpoint('/zip-loan', 'GET', zipLoanAPI, {
  simpleAuth: true,
  endpointName: 'Zip loan',
});
api.addEndpoint(
  '/properties/:propertyId/set-user-permissions',
  'POST',
  setPropertyUserPermissionsAPI,
  { rsaAuth: true, endpointName: 'Set property user permissions' },
);
api.addEndpoint(
  '/properties/:propertyId/add-user',
  'POST',
  addProUserToPropertyAPI,
  { rsaAuth: true, endpointName: 'Add pro to property' },
);
Meteor.startup(() => {
  makeFileUploadDir();
  flushFileUploadDir();
  api.start();
});
