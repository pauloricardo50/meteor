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
    // Keep old custom documents
    const oldCustomDocuments = additionalDocuments
      .filter(document =>
        document.requiredByAdmin === undefined
          && !initialDocuments.some(({ id }) => id === document.id)
          && !conditionalDocuments.some(({ id }) => id === document.id))
      .map(document => ({ ...document, requiredByAdmin: true }));

    // Keep initial documents
    documents = additionalDocuments.filter(document =>
      initialDocuments.some(({ id }) =>
        id === document.id && document.requiredByAdmin === undefined));

    // Keep required by admin
    documents = [
      ...initialDocuments.filter(({ id }) => !additionalDocuments.some(document => document.id === id)),
      ...oldCustomDocuments,
      ...documents,
      ...additionalDocuments.filter(({ requiredByAdmin }) => requiredByAdmin !== undefined),
    ];
  }

  // Check conditional documents
  const documentsToAdd = conditionalDocuments.reduce(
    (docs, { id, condition }) => {
      const document = additionalDocuments.find(additionalDocument => additionalDocument.id === id);

      if (document && document.requiredByAdmin !== undefined) {
        return docs;
      }
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
