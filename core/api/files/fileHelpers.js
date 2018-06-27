import isArray from 'lodash/isArray';
import { getPercent } from '../../utils/general';
import { FILE_STATUS } from './fileConstants';
import {
  borrowerDocuments,
  loanDocuments,
  propertyDocuments,
} from './documents';

export const getUploadCountPrefix = lastUploadCount =>
  (lastUploadCount < 10 ? `0${lastUploadCount}` : `${lastUploadCount}`);

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
  const a = [];
  const iterate = (files, doc2) => {
    if (!doc2 || !doc2.documents) {
      return;
    }

    files.forEach((f) => {
      // Check if this file should be verified
      if (!(f.required === false || f.condition === false)) {
        if (doc2.documents[f.id]) {
          if (checkValidity) {
            a.push(isArray(doc2.documents[f.id].files) &&
              doc2.documents[f.id].files.every(file => file.status === FILE_STATUS.VALID)
              ? true
              : undefined);
          } else {
            a.push(...doc2.documents[f.id].files);
          }
        } else {
          // document doesn't even exist
          a.push(undefined);
        }
      }
    });
  };

  if (isArray(doc)) {
    doc.forEach((item) => {
      const fileArray = fileArrayFunc(item)[step];
      iterate(fileArray, item);
    });
  } else {
    const fileArray = fileArrayFunc(doc)[step];
    iterate(fileArray, doc);
  }

  return getPercent(a);
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
