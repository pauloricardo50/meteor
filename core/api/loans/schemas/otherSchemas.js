import SimpleSchema from 'simpl-schema';

export const contactsSchema = {
  contacts: { type: Array, defaultValue: [] },
  'contacts.$': Object,
  'contacts.$.name': String,
  'contacts.$.title': String,
  'contacts.$.email': {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
  },
  'contacts.$.phone': String,
};

export const borrowerIdsSchema = {
  borrowerIds: { type: Array, defaultValue: [] },
  'borrowerIds.$': String,
};
