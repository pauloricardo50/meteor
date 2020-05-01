import { Mongo } from 'meteor/mongo';

const getOldCustomDocuments = ({
  additionalDocuments,
  initialDocuments,
  conditionalDocuments,
}) =>
  additionalDocuments
    .filter(
      document =>
        document.requiredByAdmin === undefined &&
        !initialDocuments.some(({ id }) => id === document.id) &&
        !conditionalDocuments.some(({ id }) => id === document.id),
    )
    .map(document => ({ ...document, requiredByAdmin: true }));

const keepInitialDocuments = ({ additionalDocuments, initialDocuments }) =>
  additionalDocuments.filter(document =>
    initialDocuments.some(
      ({ id }) => id === document.id && document.requiredByAdmin === undefined,
    ),
  );

const otherInitialDocuments = ({ initialDocuments, additionalDocuments }) =>
  initialDocuments.filter(
    ({ id }) => !additionalDocuments.some(document => document.id === id),
  );

const otherAdditionalDocuments = ({ additionalDocuments }) =>
  additionalDocuments.filter(
    ({ requiredByAdmin }) => requiredByAdmin !== undefined,
  );

const getDocumentsToAdd = ({
  additionalDocuments,
  conditionalDocuments,
  doc,
  otherCollectionDoc = {},
}) =>
  conditionalDocuments.reduce(
    (docs, { id, condition, requireOtherCollectionDoc }) => {
      const document = additionalDocuments.find(
        additionalDocument => additionalDocument.id === id,
      );

      if (document?.requiredByAdmin !== undefined) {
        return docs;
      }

      const otherCollectionDocExists = !!Object.keys(otherCollectionDoc).length;

      // Insert conditional documents
      if (!requireOtherCollectionDoc) {
        if ((document && otherCollectionDocExists) || condition({ doc })) {
          return [...docs, { id }];
        }
      } else if (
        (document && !otherCollectionDocExists) ||
        condition({ doc: otherCollectionDoc })
      ) {
        return [...docs, { id }];
      }

      return docs;
    },
    [],
  );

export const additionalDocumentsHook = ({
  collection,
  initialDocuments,
  conditionalDocuments,
  otherCollectionDoc,
}) => (userId, doc) => {
  let documents = [];
  const { additionalDocuments = [] } = doc || {};
  if (additionalDocuments.length === 0) {
    documents = initialDocuments;
  } else {
    const oldCustomDocuments = getOldCustomDocuments({
      additionalDocuments,
      initialDocuments,
      conditionalDocuments,
    });

    documents = keepInitialDocuments({ additionalDocuments, initialDocuments });

    documents = [
      ...otherInitialDocuments({ initialDocuments, additionalDocuments }),
      ...oldCustomDocuments,
      ...documents,
      ...otherAdditionalDocuments({ additionalDocuments }),
    ];
  }

  // Check conditional documents
  const documentsToAdd = getDocumentsToAdd({
    additionalDocuments,
    conditionalDocuments,
    doc,
    otherCollectionDoc,
  });

  documents = [...documents, ...documentsToAdd].filter(
    ({ id }, index, docs) =>
      docs.findIndex(({ id: docId }) => docId === id) === index,
  );

  // Update document
  Mongo.Collection.get(collection).direct.update(doc._id, {
    $set: { additionalDocuments: documents },
  });
};

export const getFieldsToWatch = ({ conditionalDocuments = [] }) =>
  conditionalDocuments
    .reduce(
      (fields, { fieldsToWatch = [] }) => [...fields, ...fieldsToWatch],
      [],
    )
    .filter((field, index, fields) => fields.indexOf(field) === index);
