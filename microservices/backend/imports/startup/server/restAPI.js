import { Meteor } from 'meteor/meteor';

import DripService from 'core/api/drip/server/DripService';
import FrontService from 'core/api/front/server/FrontService';
import IntercomService from 'core/api/intercom/server/IntercomService';
import {
  addLoanNoteAPI,
  addProUserToPropertyAPI,
  deleteFileAPI,
  dripWebhookAPI,
  frontPluginAPI,
  frontWebhookAPI,
  getPropertyAPI,
  getPropertyLoansAPI,
  getUserAPI,
  insertPropertyAPI,
  intercomWebhookAPI,
  interestRatesAPI,
  inviteCustomerToProPropertiesAPI,
  inviteUserToPromotionAPI,
  mortgageEstimateAPI,
  referCustomerAPI,
  setPropertyUserPermissionsAPI,
  testEndpointAPI,
  updatePropertyAPI,
  uploadFileAPI,
  zipLoanAPI,
} from 'core/api/RESTAPI/server/endpoints/';
import RESTAPI from 'core/api/RESTAPI/server/RESTAPI';
import { flushFileUploadDir, makeFileUploadDir } from 'core/utils/filesUtils';

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
  analyticsParams: req => {
    const { files: { file = {} } = {} } = req;
    return { fileSize: file.size };
  },
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
api.addEndpoint('/loans/add-note', 'POST', addLoanNoteAPI, {
  rsaAuth: true,
  endpointName: 'Add note to a loan',
});
api.addEndpoint('/front-plugin', 'POST', frontPluginAPI, {
  customAuth: FrontService.checkPluginAuthentication.bind(FrontService),
  endpointName: 'Front plugin',
  analyticsParams: req => {
    const { body: { type, params = {} } = {} } = req;
    const analyticsParams = { type };

    if (type === 'QUERY_ONE' || type === 'QUERY') {
      const { collectionName } = params;
      analyticsParams.collectionName = collectionName;
    } else if (type === 'METHOD') {
      const { methodName } = params;
      analyticsParams.methodName = methodName;
    }

    return analyticsParams;
  },
});
api.addEndpoint('/front-webhooks/:webhookName', 'POST', frontWebhookAPI, {
  customAuth: FrontService.checkWebhookAuthentication.bind(FrontService),
  endpointName: 'Front webhooks',
  analyticsParams: req => {
    // req.params is set by connect-route, after all middlewares
    const { url } = req;
    const [webhookName] = url.split('/').slice(-1);
    return { webhookName };
  },
});
api.addEndpoint('/intercom-webhook', 'POST', intercomWebhookAPI, {
  customAuth: IntercomService.checkWebhookAuthentication.bind(IntercomService),
  endpointName: 'Intercom webhooks',
  analyticsParams: req => {
    const { body } = req;
    const { type, topic } = body;
    return { type, topic };
  },
});
api.addEndpoint('/drip-webhook', 'POST', dripWebhookAPI, {
  customAuth: DripService.checkWebhookAuthentication.bind(DripService),
  endpointName: 'Drip webhooks',
  analyticsParams: req => {
    const { body } = req;
    const { event, custom } = body;
    return { event: event || custom?.event };
  },
});

Meteor.startup(() => {
  makeFileUploadDir();
  flushFileUploadDir();
  api.start();
});
