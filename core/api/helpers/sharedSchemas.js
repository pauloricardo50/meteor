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
