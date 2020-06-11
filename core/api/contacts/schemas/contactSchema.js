import SimpleSchema from 'simpl-schema';

import { address, createdAt, updatedAt } from '../../helpers/sharedSchemas';
import { autoValueSentenceCase } from '../../helpers/sharedSchemaValues';

const ContactSchema = new SimpleSchema({
  createdAt,
  updatedAt,
  firstName: {
    type: String,
    autoValue: autoValueSentenceCase,
  },
  lastName: {
    type: String,
    autoValue: autoValueSentenceCase,
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
