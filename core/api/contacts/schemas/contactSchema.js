import SimpleSchema from 'simpl-schema';
import { createdAt, updatedAt, address } from '../../helpers/sharedSchemas';
import {
  stringToSentenceCase,
} from '../../helpers/sharedHelpers';

const ContactSchema = new SimpleSchema({
  createdAt,
  updatedAt,
  firstName: {
    type: String,
    autoValue() {
      if (this.isSet) {
        const { value } = this;
        return stringToSentenceCase(value);
      }
    },
  },
  lastName: {
    type: String,
    autoValue() {
      if (this.isSet) {
        const { value } = this;
        return stringToSentenceCase(value);
      }
    },
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
