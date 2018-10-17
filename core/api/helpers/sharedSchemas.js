import SimpleSchema from 'simpl-schema';

export const createdAt = {
  type: Date,
  autoValue() {
    if (this.isInsert) {
      return new Date();
    }
    this.unset();
  },
  optional: true,
};

export const updatedAt = {
  type: Date,
  autoValue() {
    if (this.isUpdate) {
      return new Date();
    }
  },
  denyInsert: true,
  optional: true,
};

export const additionalDocuments = {
  additionalDocuments: { type: Array, defaultValue: [] },
  'additionalDocuments.$': Object,
  'additionalDocuments.$.id': String,
  'additionalDocuments.$.label': String,
};

export const address = {
  address1: {
    type: String,
    optional: true,
  },
  address2: {
    type: String,
    optional: true,
  },
  zipCode: {
    type: SimpleSchema.Integer,
    optional: true,
    min: 1000,
    max: 99999,
  },
  city: {
    type: String,
    optional: true,
  },
  isForeignAddress: {
    type: Boolean,
    optional: true,
    defaultValue: false,
  },
};
