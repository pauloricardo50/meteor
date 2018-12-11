import SimpleSchema from 'simpl-schema';
import { createdAt, updatedAt, address } from '../../helpers/sharedSchemas';

const ContactSchema = new SimpleSchema({
  createdAt,
  updatedAt,
  firstName: String,
  lastName: String,
  ...address,
  emails: { type: Array, optional: true },
  'emails.$': Object,
  'emails.$.address': { type: String, regEx: SimpleSchema.RegEx.Email },
  phoneNumbers: { type: Array, optional: true },
  'phoneNumbers.$': String,
  userLink: { type: String, optional: true },
});

export default ContactSchema;
