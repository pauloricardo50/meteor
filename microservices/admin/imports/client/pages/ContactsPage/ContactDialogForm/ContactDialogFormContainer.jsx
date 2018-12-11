import SimpleSchema from 'simpl-schema';
import { address } from 'core/api/helpers/sharedSchemas';
import { compose, withState, withProps } from 'recompose';
import {
  contactInsert,
  contactUpdate,
  contactRemove,
} from 'imports/core/api/methods/index';

const schema = new SimpleSchema({
  firstName: String,
  lastName: String,
  ...address,
  emails: { type: Array, optional: true },
  'emails.$': Object,
  'emails.$.address': { type: String, regEx: SimpleSchema.RegEx.Email },
  phoneNumbers: { type: Array, optional: true },
  'phoneNumbers.$': String,
});

export default compose(
  withState('submitting', 'setSubmitting', false),
  withProps(({ setOpen, setSubmitting }) => ({
    schema,
    insertContact: contact => contactInsert.run({ contact }),
    modifyContact: (data) => {
      const { _id: contactId, ...object } = data;
      setSubmitting(true);
      return contactUpdate
        .run({ contactId, object })
        .then(() => setOpen(false))
        .finally(() => setSubmitting(false));
    },
    removeContact: (contactId) => {
      setSubmitting(true);
      return contactRemove
        .run({ contactId })
        .then(() => setOpen(false))
        .finally(() => setSubmitting(false));
    },
  })),
);
