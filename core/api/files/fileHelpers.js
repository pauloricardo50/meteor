// @flow
import isArray from 'lodash/isArray';
import { getPercent } from '../../utils/general';
import { FILE_STATUS } from './fileConstants';
import {
  borrowerDocuments,
  loanDocuments,
  propertyDocuments,
} from './documents';

const documentIsRequired = (required, condition) =>
  required !== false && condition !== false;

const getDocumentsToCount = (
  documentArray: Array<Object>,
  doc: Object,
  checkDocumentStatus?: boolean,
): Array<Object> => {
  if (!doc || !doc.documents) {
    return [undefined];
  }
  const { documents } = doc;

  return documentArray.reduce(
    (documentsToCount, { required, condition, id: documentId }) => {
      if (!documentIsRequired(required, condition)) {
        // Don't count this document
        return documentsToCount;
      }

      if (!documents[documentId]) {
        // No document has been added yet, count this one, and as todo
        return [...documentsToCount, undefined];
      }

      if (checkDocumentStatus) {
        // Make sure all documents have a valid status
        const allFilesAreValid = documents[documentId].every(({ status }) => status === FILE_STATUS.VALID);
        return [...documentsToCount, allFilesAreValid ? true : undefined];
      }

      return [...documentsToCount, documents[documentId]];
    },
    [],
  );
};

/**
 * filesPercent - Determines the completion rate of file upload for a given
 * step, doc and array of files
 *
 * @param {object} doc           The mongoDB document where files are saved
 * @param {function} fileArrayFunc A function that returns an array of files
 * @param {number} step          The step that determines which files are
 * required at this moment
 *
 * @return {number} a value between 0 and 1 indicating the percentage of
 * completion, 1 is complete, 0 is not started
 */
export const filesPercent = ({ doc, fileArrayFunc, step, checkValidity }) => {
  let documentsToCount = [];

  if (isArray(doc)) {
    doc.forEach((item) => {
      const fileArray = fileArrayFunc(item)[step];
      documentsToCount = [
        ...documentsToCount,
        ...getDocumentsToCount(fileArray, item, checkValidity),
      ];
    });
  } else {
    const fileArray = fileArrayFunc(doc)[step];
    documentsToCount = getDocumentsToCount(fileArray, doc, checkValidity);
  }

  return getPercent(documentsToCount);
};

export const getAllFilesPercent = ({ loan, borrowers, property }, step) => {
  const array = [];
  if (loan) {
    array.push(filesPercent({ doc: loan, fileArrayFunc: loanDocuments, step }));
  }

  if (borrowers) {
    array.push(filesPercent({ doc: borrowers, fileArrayFunc: borrowerDocuments, step }));
  }

  if (property) {
    array.push(filesPercent({ doc: property, fileArrayFunc: propertyDocuments, step }));
  }

  // Sum and divide by amount of them
  return array.reduce((a, b) => a + b, 0) / array.length;
};

const documentExists = (doc, id) =>
  doc && doc.documents && doc.documents[id] && doc.documents[id].length > 0;

export const getMissingDocumentIds = ({ doc, fileArrayFunc, step }) => {
  const fileArray = fileArrayFunc(doc)[step];
  const ids = fileArray
    .filter(({ required, condition, id }) =>
      documentIsRequired(required, condition) && !documentExists(doc, id))
    .map(({ id }) => id);
  return ids;
};
