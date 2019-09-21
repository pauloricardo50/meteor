import SimpleSchema from 'simpl-schema';
import { createdAt, updatedAt, address } from '../../helpers/sharedSchemas';
import {
  autoValueToSentenceCase,
} from '../../helpers/sharedSchemaValues';

const ContactSchema = new SimpleSchema({
  createdAt,
  updatedAt,
  firstName: {
    type: String,
    autoValue: autoValueToSentenceCase,
  },
  lastName: {
    type: String,
    autoValue: autoValueToSentenceCase,
  },
  ...address,
  emails: { type: Array, optional: true },
  'emails.$': Object,
  'emails.$.address': { type: String, regEx: SimpleSchema.RegEx.Email },
  phoneNumbers: { type: Array, optional: true },
  'phoneNumbers.$': String,
  userLink: { type: String, optional: true },
});

export default ContactSchema;
