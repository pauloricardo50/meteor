import archiver from 'archiver';

import Intl from 'core/utils/server/intl';
import LoanService from '../../../../loans/server/LoanService';
import { zipDocuments } from './zipHelpers';
import {
  DOCUMENTS,
  DOCUMENTS_CATEGORIES,
} from '../../../../files/fileConstants';
import { withMeteorUserId } from '../../helpers';
import { RESPONSE_ALREADY_SENT } from '../../restApiConstants';
import FileService from '../../../../files/server/FileService';
import FilesBinPacker from './FilesBinPacker';

export const getFileName = ({
  Key,
  name,
  index,
  total,
  adminName,
  prefix = '',
  root = '',
  additionalDocuments = [],
  options = {},
  filesBinPacker,
}) => {
  const { extension, documentId } = FileService.getKeyParts(Key);

  const { label } = additionalDocuments.find(({ id }) => id === documentId) || {};

  const { packFiles } = options;

  let binPath = '';

  if (packFiles) {
    const { binIndex } = filesBinPacker
      .getFilesBinIndex()
      .find(({ Key: fileKey }) => fileKey === Key);
    binPath = `DECK_${binIndex + 1}/`;
  }

  if (label) {
    return `${root}${binPath}${prefix}${label}.${extension}`;
  }

  if (adminName) {
    return `${root}${binPath}${prefix}${adminName}.${extension}`;
  }

  const suffix = total > 1 && documentId !== DOCUMENTS.OTHER
    ? ` (${index + 1} sur ${total})`
    : '';

  return documentId === DOCUMENTS.OTHER
    || !Object.keys(DOCUMENTS_CATEGORIES)
      .reduce(
        (allCategories, cat) => [
          ...allCategories,
          ...DOCUMENTS_CATEGORIES[cat].map(c => c),
        ],
        [],
      )
      .includes(documentId)
    ? `${root}${binPath}${prefix}${
      name.split('.').slice(0, -1)[0]
    }${suffix}.${extension}`
    : `${root}${binPath}${prefix}${Intl.formatMessage({
      id: `files.${documentId}`,
    })}${suffix}.${extension}`;
};

const makeFormatFileName = ({
  root,
  additionalDocuments,
  prefix,
  filesBinPacker,
  options,
}) => ({ name: originalName, Key, adminname: adminName }, index, total) =>
  getFileName({
    Key,
    name: originalName,
    index,
    total,
    adminName,
    additionalDocuments,
    root,
    prefix,
    filesBinPacker,
    options,
  });

const filterDocuments = (documentsToFilter, docId, documents) =>
  Object.keys(documentsToFilter)
    .filter(document => documents[docId].some(doc => document === doc))
    .reduce(
      (docs, document) => ({
        ...docs,
        [document]: documentsToFilter[document],
      }),
      {},
    );

const zipDocFiles = ({
  zip,
  documents,
  options,
  doc,
  root = () => '',
  prefix = () => '',
}) => {
  const { packFiles } = options;
  const { _id: docId, additionalDocuments = [], documents: docDocuments } = doc;
  const filteredDocuments = filterDocuments(
    docDocuments,
    docId,
    documents,
    options,
  );
  let filesBinPacker;

  if (packFiles) {
    filesBinPacker = new FilesBinPacker(Object.keys(filteredDocuments).reduce(
      (allFiles, key) => [...allFiles, ...filteredDocuments[key]],
      [],
    ));
    filesBinPacker.packFiles();
  }

  zipDocuments({
    zip,
    documents: filteredDocuments,
    options,
    formatFileName: makeFormatFileName({
      root: root(doc),
      additionalDocuments,
      prefix: prefix(doc),
      filesBinPacker,
      options,
    }),
  });
};

export const generateLoanZip = ({ zip, loan, documents, options, res }) => {
  const {
    properties = [],
    borrowers = [],
    structure = {},
    hasPromotion,
  } = loan;
  res.writeHead(200, {
    'Content-Disposition': `attachment; filename=${loan.name}.zip`,
  });
  zip.pipe(res);

  // Zip loan files
  zipDocFiles({
    zip,
    doc: loan,
    documents,
    options,
    root: ({ name }) => `${name}/`,
  });

  // Zip borrowers files
  borrowers.forEach(borrower =>
    zipDocFiles({
      zip,
      doc: borrower,
      documents,
      options,
      root: ({ name }) => `${name}/`,
      prefix: ({ firstName, lastName }) =>
        `${firstName.toUpperCase()[0]}${lastName.toUpperCase()[0]} `,
    }));

  if (!hasPromotion) {
    // Zip propterty files
    zipDocFiles({
      zip,
      doc: properties.find(({ _id }) => _id === structure.propertyId),
      documents,
      options,
      root: ({ address1 }) => `${address1}/`,
      prefix: ({ address1 }) => `${address1} `,
    });
  }

  zip.finalize();
};

const zipLoan = ({
  res,
  simpleAuthParams: { loanId, userId, documents, options },
}) => {
  withMeteorUserId({ userId }, () => {
    const zip = new archiver.create('zip');

    const loan = LoanService.fetchOne({
      $filters: { _id: loanId },
      borrowers: {
        firstName: 1,
        lastName: 1,
        name: 1,
        documents: 1,
        additionalDocuments: 1,
      },
      properties: { address1: 1, documents: 1, additionalDocuments: 1 },
      structure: 1,
      documents: 1,
      additionalDocuments: 1,
      name: 1,
      hasPromotion: 1,
    });

    generateLoanZip({ zip, loan, documents, options, res });
  });
  return Promise.resolve(RESPONSE_ALREADY_SENT);
};

export default zipLoan;
