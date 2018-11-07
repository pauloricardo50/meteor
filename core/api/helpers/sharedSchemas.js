import SimpleSchema from 'simpl-schema';
import { Mongo } from 'meteor/mongo';
import { DOCUMENT_USER_PERMISSIONS } from '../constants';

// import Properties from '../properties';

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

export const additionalDocumentsAutovalue = ({
  doc,
  conditionalDocuments,
  initialDocuments,
  context,
}) => {
  const currentDocuments = doc.additionalDocuments;
  console.log('currentDocuments', currentDocuments);

  const documentsModifications = conditionalDocuments.reduce(
    (modifications, { id, condition }) => {
      const conditionIsMet = condition({ doc, context });
      const documentExists = currentDocuments.some(({ id: documentId }) => id === documentId);

      if (conditionIsMet && !documentExists) {
        return {
          documentsToAdd: [...modifications.documentsToAdd, id],
          documentsToRemove: modifications.documentsToRemove,
        };
      }

      if (conditionIsMet && documentExists) {
        return modifications;
      }

      if (!conditionIsMet && !documentExists) {
        return modifications;
      }

      if (!conditionIsMet && documentExists) {
        return {
          documentsToAdd: modifications.documentsToAdd,
          documentsToRemove: [...modifications.documentsToRemove, id],
        };
      }

      return modifications;
    },
    {
      documentsToAdd: [],
      documentsToRemove: [],
    },
  );
  console.log('documentsModifications', documentsModifications);

  const documents = [
    ...currentDocuments,
    ...documentsModifications.documentsToAdd.map(id => ({ id })),
  ].filter(({ id }) =>
    !documentsModifications.documentsToRemove.some(idToRemove => idToRemove === id));

  console.log('documents', documents);
  return context.isInsert ? [...initialDocuments, ...documents] : documents;
};

export const additionalDocuments = ({
  collection,
  initialDocuments,
  conditionalDocuments,
}) => ({
  additionalDocuments: {
    type: Array,
    autoValue() {
      const doc = Mongo.Collection.get(collection).findOne(this.docId) || {
        additionalDocuments: [],
      };

      return additionalDocumentsAutovalue({
        doc,
        initialDocuments,
        conditionalDocuments,
        context: this,
      });
    },
  },
  'additionalDocuments.$': Object,
  'additionalDocuments.$.id': String,
  'additionalDocuments.$.label': { type: String, optional: true },
});

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

export const contactsSchema = {
  contacts: { type: Array, defaultValue: [] },
  'contacts.$': Object,
  'contacts.$.name': { type: String, uniforms: { label: 'Prénom Nom' } },
  'contacts.$.title': { type: String, uniforms: { label: 'Fonction/Titre' } },
  'contacts.$.email': {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    optional: true,
  },
  'contacts.$.phoneNumber': {
    type: String,
    uniforms: { label: 'No. de Téléphone' },
    optional: true,
  },
};

export const userLinksSchema = {
  userLinks: { type: Array, defaultValue: [] },
  'userLinks.$': Object,
  'userLinks.$._id': String,
  'userLinks.$.permissions': {
    type: String,
    allowedValues: Object.values(DOCUMENT_USER_PERMISSIONS),
  },
};
