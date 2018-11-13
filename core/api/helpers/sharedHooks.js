import { Mongo } from 'meteor/mongo';

export const additionalDocumentsHook = ({
  collection,
  initialDocuments,
  conditionalDocuments,
}) => (userId, doc) => {
  let documents = [];
  const { additionalDocuments } = doc || { additionalDocuments: [] };
  // Insert initial documents
  if (additionalDocuments.length === 0) {
    documents = initialDocuments;
  } else {
    // Keep initial documents
    documents = additionalDocuments.filter(document =>
      initialDocuments.some(({ id }) => id === document.id));

    // Keep required by admin
    documents = [
      ...documents,
      ...additionalDocuments.filter(({ requiredByAdmin }) => requiredByAdmin !== undefined),
    ];
  }

  // Check conditional documents
  const documentsToAdd = conditionalDocuments.reduce(
    (docs, { id, condition }) => {
      // Insert conditional documents
      if (condition({ doc })) {
        return [...docs, { id }];
      }

      return docs;
    },
    [],
  );

  documents = [...documents, ...documentsToAdd];

  // Update document
  Mongo.Collection.get(collection).direct.update(doc._id, {
    $set: { additionalDocuments: documents },
  });
};
