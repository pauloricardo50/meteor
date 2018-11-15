import { Mongo } from 'meteor/mongo';
import {
  PROPERTIES_COLLECTION,
  BORROWERS_COLLECTION,
  LOANS_COLLECTION,
} from '../constants';
import {
  DOCUMENTS,
  DOCUMENTS_WITH_TOOLTIP,
  BORROWER_DOCUMENTS,
  PROPERTY_DOCUMENTS,
  LOAN_DOCUMENTS,
} from './fileConstants';

export const allDocuments = ({ doc, collection }) => {
  const s3Documents = doc.documents
    ? Object.keys(doc.documents).map(key => ({ id: key }))
    : [];
  let documents = [];
  switch (collection) {
  case BORROWERS_COLLECTION:
    documents = Object.values(BORROWER_DOCUMENTS).map(id => ({
      id,
      noTooltips: !DOCUMENTS_WITH_TOOLTIP.some(documentId => documentId === id),
    }));
    break;
  case PROPERTIES_COLLECTION:
    documents = Object.values(PROPERTY_DOCUMENTS).map(id => ({
      id,
      noTooltips: !DOCUMENTS_WITH_TOOLTIP.some(documentId => documentId === id),
    }));
    break;
  case LOANS_COLLECTION:
    documents = Object.values(LOAN_DOCUMENTS).map(id => ({
      id,
      noTooltips: !DOCUMENTS_WITH_TOOLTIP.some(documentId => documentId === id),
    }));
    break;
  default:
    break;
  }

  return doc.additionalDocuments && doc.additionalDocuments.length > 0
    ? [
      ...doc.additionalDocuments,
      ...documents.filter(({ id }) =>
        !doc.additionalDocuments.some(document => id === document.id)),
      ...s3Documents.filter(({ id }) =>
        !doc.additionalDocuments.some(document => id === document.id)
            && !documents.some(document => id === document.id)),
    ]
    : documents;
};

const makeGetDocuments = collection => ({ loan, id }, ...args) => {
  const isLoans = collection === LOANS_COLLECTION;
  if (!id && !isLoans) {
    return [];
  }

  const doc = (!isLoans && loan[collection].find(({ _id }) => _id === id)) || loan;

  return [
    ...(doc && doc.additionalDocuments && doc.additionalDocuments.length > 0
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
