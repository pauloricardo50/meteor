import { Meteor } from 'meteor/meteor';
import { getLoginServices } from '../../helpers.js';

Meteor.publish('servicesList', function () {
  const services = getLoginServices();
  if (Package['accounts-password']) {
    services.push({ name: 'password' });
  }
  const fields = {};
  // Publish the existing services for a user, only name or nothing else.
  services.forEach(service => (fields[`services.${service.name}.name`] = 1));
  return Meteor.users.find({ _id: this.userId }, { fields });
});
