import { withProps } from 'recompose';
import {
  BORROWERS_COLLECTION,
  BORROWER_DOCUMENTS,
  PROPERTIES_COLLECTION,
  PROPERTY_DOCUMENTS,
  LOANS_COLLECTION,
  LOAN_DOCUMENTS,
  DOCUMENTS,
} from '../../api/constants';
import {
  getBorrowerDocuments,
  getPropertyDocuments,
  getLoanDocuments,
} from '../../api/files/documents';

const allDocuments = ({ doc, collection }) => {
  let documents = [];
  switch (collection) {
  case BORROWERS_COLLECTION:
    documents = Object.values(BORROWER_DOCUMENTS).map(id => ({
      id,
    }));
    break;
  case PROPERTIES_COLLECTION:
    documents = Object.values(PROPERTY_DOCUMENTS).map(id => ({
      id,
    }));
    break;
  case LOANS_COLLECTION:
    documents = Object.values(LOAN_DOCUMENTS).map(id => ({
      id,
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
    ]
    : documents;
};

const documentsToDisplay = ({ collection, loan, id }) => {
  switch (collection) {
  case BORROWERS_COLLECTION:
    return getBorrowerDocuments({ loan, id });
  case PROPERTIES_COLLECTION:
    return getPropertyDocuments({ loan, id });
  case LOANS_COLLECTION:
    return getLoanDocuments({ loan, id });
  default:
    return [];
  }
};

const documentsToHide = ({ doc, collection, loan, id }) =>
  allDocuments({ doc, collection }).filter(document =>
    !documentsToDisplay({ collection, loan, id }).some(({ id: docId }) => docId === document.id));

const getFileMeta = ({ doc, id }) =>
  doc.additionalDocuments
  && doc.additionalDocuments.length > 0
  && doc.additionalDocuments.find(document => document.id === id);

const sortDocuments = (a, b) => {
  if (a.id === DOCUMENTS.OTHER) {
    return 1;
  }

  if (a.id < b.id) {
    return -1;
  }

  if (a.id > b.id) {
    return 1;
  }

  return 0;
};

export default withProps(({ doc, collection, loan }) => ({
  documentsToDisplay: documentsToDisplay({
    collection,
    loan,
    id: doc._id,
  }).sort(sortDocuments),
  documentsToHide: documentsToHide({ doc, collection, loan, id: doc._id }).sort(sortDocuments),
  getFileMeta,
}));
