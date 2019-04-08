import { Meteor } from 'meteor/meteor';

import RESTAPI from 'core/api/RESTAPI/server/RESTAPI';
import {
  inviteUserToPromotionAPI,
  inviteUserToProPropertyAPI,
  inviteUserToProPropertiesAPI,
  testEndpointAPI,
} from 'core/api/RESTAPI/server/endpoints/';

const api = new RESTAPI();
api.addEndpoint(
  '/promotions/:promotionId/invite-customer',
  'POST',
  inviteUserToPromotionAPI,
);
api.addEndpoint(
  '/properties/:propertyId/invite-customer',
  'POST',
  inviteUserToProPropertyAPI,
);
api.addEndpoint(
  '/properties/invite-customer',
  'POST',
  inviteUserToProPropertiesAPI,
);
api.addEndpoint('/test', 'POST', testEndpointAPI);
api.addEndpoint('/test', 'GET', testEndpointAPI);
api.addEndpoint('/test', 'PUT', testEndpointAPI);
api.addEndpoint('/test', 'DELETE', testEndpointAPI);
api.addEndpoint('/test/:id', 'POST', testEndpointAPI);
api.addEndpoint('/test/:id', 'GET', testEndpointAPI);
api.addEndpoint('/test/:id', 'PUT', testEndpointAPI);
api.addEndpoint('/test/:id', 'DELETE', testEndpointAPI);

Meteor.startup(() => {
  api.start();
});
