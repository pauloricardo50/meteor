import { Meteor } from 'meteor/meteor';

import RESTAPI from 'core/api/RESTAPI/server/RESTAPI';
import inviteUserToPromotion from 'core/api/RESTAPI/server/endpoints/inviteUserToPromotion';

const api = new RESTAPI();
api.addEndpoint('/promotions/:promotionId/inviteCustomer', 'POST', inviteUserToPromotion);

Meteor.startup(() => {
  api.start();
});
