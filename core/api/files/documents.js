import intl from '../../utils/intl';
import { BORROWERS_COLLECTION } from '../borrowers/borrowerConstants';
import { INSURANCE_REQUESTS_COLLECTION } from '../insuranceRequests/insuranceRequestConstants';
import { INSURANCES_COLLECTION } from '../insurances/insuranceConstants';
import { LOANS_COLLECTION } from '../loans/loanConstants';
import { PROPERTIES_COLLECTION } from '../properties/propertyConstants';
import {
  BASIC_DOCUMENTS_LIST,
  BORROWER_DOCUMENTS,
  DISPLAYABLE_FILES,
  DOCUMENTS,
  FILE_STATUS,
  INSURANCE_DOCUMENTS,
  INSURANCE_REQUEST_DOCUMENTS,
  LOAN_DOCUMENTS,
  PROPERTY_DOCUMENTS,
} from './fileConstants';

export const documentHasTooltip = documentId => {
  const { formatMessage } = intl;
  return (
    formatMessage({ id: `files.${documentId}.tooltip` }) !==
    `files.${documentId}.tooltip`
  );
};

export const documentIsBasic = documentId =>
  BASIC_DOCUMENTS_LIST.includes(documentId);

const makeAllObjectDocuments = documents =>
  Object.values(documents).map(id => ({
    id,
    noTooltips: !documentHasTooltip(id),
    displayableFile: Object.keys(DISPLAYABLE_FILES).includes(id),
    maxSizeOverride: DISPLAYABLE_FILES[id]?.maxSizeOverride,
  }));

export const getAllDocuments = ({ doc, collection }) => {
  const { documents, additionalDocuments = [] } = doc;
  const s3Documents = documents
    ? Object.keys(documents).map(key => ({ id: key }))
    : [];
  let allDocuments = [];
  switch (collection) {
    case BORROWERS_COLLECTION:
      allDocuments = makeAllObjectDocuments(BORROWER_DOCUMENTS);
      break;
    case PROPERTIES_COLLECTION:
      allDocuments = makeAllObjectDocuments(PROPERTY_DOCUMENTS);
      break;
    case LOANS_COLLECTION:
      allDocuments = makeAllObjectDocuments(LOAN_DOCUMENTS);
      break;
    case INSURANCE_REQUESTS_COLLECTION:
      allDocuments = makeAllObjectDocuments(INSURANCE_REQUEST_DOCUMENTS);
      break;
    case INSURANCES_COLLECTION:
      allDocuments = makeAllObjectDocuments(INSURANCE_DOCUMENTS);
      break;
    default:
      break;
  }

  const otherAdditionalDocuments = allDocuments.filter(
    ({ id }) => !additionalDocuments.some(document => id === document.id),
  );
  const legacyCustomDocuments = s3Documents.filter(
    ({ id }) =>
      !additionalDocuments.some(document => id === document.id) &&
      !allDocuments.some(document => id === document.id),
  );

  return doc.additionalDocuments && doc.additionalDocuments.length > 0
    ? [
        ...doc.additionalDocuments,
        ...otherAdditionalDocuments,
        ...legacyCustomDocuments,
      ]
    : allDocuments;
};

const requiredByAdminOnly = ({ requiredByAdmin }) => requiredByAdmin !== false;

const formatAdditionalDoc = additionalDoc => ({
  ...additionalDoc,
  required: true,
  noTooltips: !documentHasTooltip(additionalDoc.id),
  displayableFile: Object.keys(DISPLAYABLE_FILES).includes(additionalDoc.id),
  maxSizeOverride: DISPLAYABLE_FILES[additionalDoc.id]?.maxSizeOverride,
});

const makeGetDocuments = collection => ({ loan, id }, options = {}) => {
  const { doc } = options;

  const isLoans = collection === LOANS_COLLECTION;
  if (!id && !isLoans) {
    return [];
  }

  const document =
    doc || (!isLoans && loan[collection].find(({ _id }) => _id === id)) || loan;
  const additionalDocumentsExist = document?.additionalDocuments?.length > 0;

  const documentsExist = Object.keys(document?.documents || {}).length > 0;

  const additionalDocuments = additionalDocumentsExist
    ? document.additionalDocuments
        .filter(requiredByAdminOnly)
        .map(formatAdditionalDoc)
    : [];

  // Get all validated documents, ignoring if they are required by admin or not
  const validatedDocuments = documentsExist
    ? Object.keys(document.documents)
        .reduce((validDocuments, key) => {
          const files = document.documents[key] || [];
          // At least one file is validated
          const oneFileIsValid = files.some(
            ({ status }) => status === FILE_STATUS.VALID,
          );

          return oneFileIsValid
            ? [...validDocuments, { id: key }]
            : validDocuments;
        }, [])
        .map(formatAdditionalDoc)
        // Don't return a valid document already present in additionalDocuments
        .filter(
          ({ id: docId }) =>
            !additionalDocuments.some(
              ({ id: additionnalDocId }) => additionnalDocId === docId,
            ),
        )
    : [];

  return [
    ...additionalDocuments,
    ...validatedDocuments,
    { id: DOCUMENTS.OTHER, required: false, noTooltips: true },
  ].filter(
    ({ id: docId }, index, self) =>
      self.findIndex(d => d.id === docId) === index,
  );
};

export const getPropertyDocuments = makeGetDocuments(PROPERTIES_COLLECTION);
export const getBorrowerDocuments = makeGetDocuments(BORROWERS_COLLECTION);
export const getLoanDocuments = makeGetDocuments(LOANS_COLLECTION);
export const getInsuranceRequestDocuments = makeGetDocuments(
  INSURANCE_REQUESTS_COLLECTION,
);
export const getInsuranceDocuments = makeGetDocuments(INSURANCES_COLLECTION);
