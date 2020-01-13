import { formatMessage } from 'core/utils/intl';
import {
  PROPERTIES_COLLECTION,
  BORROWERS_COLLECTION,
  LOANS_COLLECTION,
} from '../constants';
import {
  DOCUMENTS,
  BORROWER_DOCUMENTS,
  PROPERTY_DOCUMENTS,
  LOAN_DOCUMENTS,
} from './fileConstants';

export const documentHasTooltip = documentId =>
  formatMessage({ id: `files.${documentId}.tooltip` }) !==
  `files.${documentId}.tooltip`;

const makeAllObjectDocuments = documents =>
  Object.values(documents).map(id => ({
    id,
    noTooltips: documentHasTooltip(id),
  }));

export const allDocuments = ({ doc, collection }) => {
  const s3Documents = doc.documents
    ? Object.keys(doc.documents).map(key => ({ id: key }))
    : [];
  let documents = [];
  switch (collection) {
    case BORROWERS_COLLECTION:
      documents = makeAllObjectDocuments(BORROWER_DOCUMENTS);
      break;
    case PROPERTIES_COLLECTION:
      documents = makeAllObjectDocuments(PROPERTY_DOCUMENTS);
      break;
    case LOANS_COLLECTION:
      documents = makeAllObjectDocuments(LOAN_DOCUMENTS);
      break;
    default:
      break;
  }

  const otherAdditionalDocuments = documents.filter(
    ({ id }) => !doc.additionalDocuments.some(document => id === document.id),
  );
  const legacyCustomDocuments = s3Documents.filter(
    ({ id }) =>
      !doc.additionalDocuments.some(document => id === document.id) &&
      !documents.some(document => id === document.id),
  );

  return doc.additionalDocuments && doc.additionalDocuments.length > 0
    ? [
        ...doc.additionalDocuments,
        ...otherAdditionalDocuments,
        ...legacyCustomDocuments,
      ]
    : documents;
};

const requiredByAdminOnly = ({ requiredByAdmin }) => requiredByAdmin !== false;

const formatAdditionalDoc = additionalDoc => ({
  ...additionalDoc,
  required: true,
  noTooltips: documentHasTooltip(additionalDoc.id),
});

const makeGetDocuments = collection => ({ loan, id }, options = {}) => {
  const { doc } = options;

  const isLoans = collection === LOANS_COLLECTION;
  if (!id && !isLoans) {
    return [];
  }

  const document =
    doc || (!isLoans && loan[collection].find(({ _id }) => _id === id)) || loan;
  const additionalDocumentsExist =
    document &&
    document.additionalDocuments &&
    document.additionalDocuments.length > 0;

  return [
    ...(additionalDocumentsExist
      ? document.additionalDocuments
          .filter(requiredByAdminOnly)
          .map(formatAdditionalDoc)
      : []),
    { id: DOCUMENTS.OTHER, required: false, noTooltips: true },
  ];
};

export const getPropertyDocuments = makeGetDocuments(PROPERTIES_COLLECTION);
export const getBorrowerDocuments = makeGetDocuments(BORROWERS_COLLECTION);
export const getLoanDocuments = makeGetDocuments(LOANS_COLLECTION);
