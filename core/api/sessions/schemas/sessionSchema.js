import SimpleSchema from 'simpl-schema';
import { ROLES } from 'core/api/users/userConstants';
import { createdAt, updatedAt } from '../../helpers/sharedSchemas';

const SessionSchema = new SimpleSchema({
  createdAt,
  updatedAt,
  connectionId: String,
  microservice: { type: String, optional: true },
  ip: String,
  userId: { type: String, optional: true },
  role: { type: String, allowedValues: ROLES, optional: true },
  isImpersonate: { type: Boolean, defaultValue: false },
  lastPageVisited: { type: String, optional: true },
  lastMethodCalled: { type: String, optional: true },
});

export default SessionSchema;
