import { Meteor } from 'meteor/meteor';

import RESTAPI from 'core/api/RESTAPI/RESTAPI';
import inviteUserToPromotion from 'imports/core/api/RESTAPI/server/endpoints/index';

const api = new RESTAPI();
api.addEndpoint('/inviteUserToPromotion', 'POST', inviteUserToPromotion);

Meteor.startup(() => {
  api.start();
});
