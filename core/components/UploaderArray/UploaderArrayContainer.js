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

const documentsToDisplay = doc =>
  (doc.additionalDocuments && doc.additionalDocuments.length > 0
    ? doc.additionalDocuments.filter(({ requiredByAdmin }) => requiredByAdmin !== false)
    : []);

const documentsToHide = ({ doc, collection }) =>
  allDocuments({ doc, collection }).filter(({ requiredByAdmin }) => requiredByAdmin !== true);

const getFileMeta = ({ doc, id }) =>
  (doc.additionalDocuments && doc.additionalDocuments.length > 0
    ? doc.additionalDocuments.find(document => document.id === id)
    : {});

const sortDocuments = (a, b) => {
  if (a.id < b.id) {
    return -1;
  }

  if (a.id > b.id) {
    return 1;
  }

  return 0;
};

export default withProps(({ doc, collection }) => ({
  documentsToDisplay: documentsToDisplay(doc).sort(sortDocuments),
  documentsToHide: documentsToHide({ doc, collection }).sort(sortDocuments),
  getFileMeta,
}));
