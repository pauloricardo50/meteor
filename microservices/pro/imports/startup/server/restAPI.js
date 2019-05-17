import { Meteor } from 'meteor/meteor';

import RESTAPI from 'core/api/RESTAPI/server/RESTAPI';
import {
  getPropertyLoansAPI,
  getUserAPI,
  interestRatesAPI,
  inviteUserToPromotionAPI,
  inviteUserToProPropertiesAPI,
  mortgageEstimateAPI,
  referCustomerAPI,
  testEndpointAPI,
  updatePropertyAPI,
} from 'core/api/RESTAPI/server/endpoints/';

const api = new RESTAPI();
api.addEndpoint(
  '/promotions/:promotionId/invite-customer',
  'POST',
  inviteUserToPromotionAPI,
);
api.addEndpoint(
  '/properties/invite-customer',
  'POST',
  inviteUserToProPropertiesAPI,
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

Meteor.startup(() => {
  api.start();
});
