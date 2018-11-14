import { Mongo } from 'meteor/mongo';
import {
  PROPERTIES_COLLECTION,
  BORROWERS_COLLECTION,
  LOANS_COLLECTION,
} from '../constants';
import { DOCUMENTS, DOCUMENTS_WITH_TOOLTIP } from './fileConstants';

const makeGetDocuments = collection => ({ loan, id }, ...args) => {
  const isLoans = collection === LOANS_COLLECTION;
  if (!id && !isLoans) {
    return [];
  }

  const doc = !isLoans
    ? Mongo.Collection.get(collection).findOne({ _id: id })
    : loan;

  return [
    ...(doc && doc.additionalDocuments
      ? doc.additionalDocuments
        .filter(additionalDoc => additionalDoc.requiredByAdmin !== false)
        .map(additionalDoc => ({
          ...additionalDoc,
          required: true,
          noTooltips: !DOCUMENTS_WITH_TOOLTIP.some(documentId => documentId === additionalDoc.id),
        }))
      : []),
    { id: DOCUMENTS.OTHER, required: false, noTooltips: true },
  ];
};

export const getPropertyDocuments = makeGetDocuments(PROPERTIES_COLLECTION);
export const getBorrowerDocuments = makeGetDocuments(BORROWERS_COLLECTION);
export const getLoanDocuments = makeGetDocuments(LOANS_COLLECTION);
