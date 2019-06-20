import { Mongo } from 'meteor/mongo';

import SimpleSchema from 'simpl-schema';

import { createdAt, updatedAt } from '../helpers/sharedSchemas';
import { NOTIFICATIONS_COLLECTION } from './notificationConstants';

const Notifications = new Mongo.Collection(NOTIFICATIONS_COLLECTION);
const NotificationSchema = new SimpleSchema({
  createdAt,
  updatedAt,
  recipientLinks: { type: Array, minCount: 1 },
  'recipientLinks.$': Object,
  'recipientLinks.$._id': String,
  'recipientLinks.$.read': { type: Boolean, defaultValue: false },
  'recipientLinks.$.readDate': { type: Date, optional: true },
  'recipientLinks.$.snoozeDate': { type: Date, optional: true },
  taskLink: { type: Object, optional: true },
  'taskLink._id': String,
  activityLink: { type: Object, optional: true },
  'activityLink._id': String,
});

Notifications.attachSchema(NotificationSchema);

export default Notifications;
