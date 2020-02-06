import { getPercent } from '../../utils/general';
import { FILE_STATUS } from './fileConstants';
import { documentIsBasic } from './documents';

const documentIsRequired = required => required !== false;

const documentIsInvalid = (doc, id) =>
  doc &&
  doc.documents &&
  doc.documents[id] &&
  doc.documents[id].length > 0 &&
  doc.documents[id].some(({ status }) => status === FILE_STATUS.ERROR);

const getDocumentsToCount = (documentArray, doc, checkDocumentStatus) => {
  if (!doc || !doc.documents) {
    return [undefined];
  }
  const { documents } = doc;

  return documentArray.reduce(
    (documentsToCount, { required, id: documentId }) => {
      if (!documentIsRequired(required)) {
        // Don't count this document
        return documentsToCount;
      }

      if (!documents[documentId]) {
        // No document has been added yet, count this one, and as todo
        return [...documentsToCount, undefined];
      }

      if (checkDocumentStatus) {
        // Make sure all documents have a valid status
        const allFilesAreValid = documents[documentId].every(
          ({ status }) => status === FILE_STATUS.VALID,
        );
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
 * @param {function} fileArray   Array of files

 *
 * @return {number} a value between 0 and 1 indicating the percentage of
 * completion, 1 is complete, 0 is not started
 */
export const filesPercent = ({ fileArray, doc, checkValidity }) => {
  const documentsToCount = getDocumentsToCount(fileArray, doc, checkValidity);
  return {
    percent: getPercent(documentsToCount),
    count: documentsToCount.length,
  };
};

const documentExists = (doc, id) =>
  doc && doc.documents && doc.documents[id] && doc.documents[id].length > 0;

export const getMissingDocumentIds = ({
  fileArray,
  doc,
  basicDocumentsOnly,
}) => {
  const ids = fileArray
    .filter(
      ({ required, id }) =>
        (documentIsRequired(required) && !documentExists(doc, id)) ||
        documentIsInvalid(doc, id),
    )
    .map(({ id }) => id)
    .filter(id => {
      if (basicDocumentsOnly) {
        return documentIsBasic(id);
      }

      return true;
    });
  return ids;
};

export const getRequiredDocumentIds = fileArray =>
  fileArray
    .filter(({ required }) => documentIsRequired(required))
    .map(({ id }) => id);
