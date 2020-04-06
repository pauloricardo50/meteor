import SimpleSchema from 'simpl-schema';

import { createdAt, updatedAt } from '../../helpers/sharedSchemas';
import { ROLES } from '../../users/userConstants';

const SessionSchema = new SimpleSchema({
  createdAt,
  updatedAt,
  connectionId: String,
  microservice: { type: String, optional: true },
  ip: String,
  userId: { type: String, optional: true },
  role: { type: String, allowedValues: ROLES, optional: true },
  isImpersonate: { type: Boolean, defaultValue: false },
  shared: { type: Boolean, optional: true, defaultValue: false },
  lastPageVisited: { type: String, optional: true },
  lastMethodCalled: { type: String, optional: true },
  userIsConnected: { type: Boolean, optional: true, defaultValue: false },
  impersonatingAdminLink: { type: Object, optional: true },
  'impersonatingAdminLink._id': { type: String, optional: true },
  followed: { type: Boolean, optional: true, defaultValue: false },
});

export default SessionSchema;
