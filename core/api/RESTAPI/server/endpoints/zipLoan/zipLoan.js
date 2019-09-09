import archiver from 'archiver';

import Intl from 'core/utils/server/intl';
import LoanService from '../../../../loans/server/LoanService';
import { zipDocuments, splitFilesInChunks } from './zipHelpers';
import {
  DOCUMENTS,
  DOCUMENTS_CATEGORIES,
} from '../../../../files/fileConstants';
import { withMeteorUserId } from '../../helpers';
import { RESPONSE_ALREADY_SENT } from '../../restApiConstants';
import FileService from '../../../../files/server/FileService';
import FilesChunksManager from './FilesChunksManager';

export const getFileName = ({
  Key,
  name,
  index,
  total,
  adminName,
  prefix = '',
  root = '',
  additionalDocuments = [],
  filesChunks,
  options = {},
}) => {
  const { extension, documentId } = FileService.getKeyParts(Key);

  const { label } = additionalDocuments.find(({ id }) => id === documentId) || {};

  const { splitInChunks } = options;

  let chunkPath = '';

  if (splitInChunks) {
    const { chunkIndex } = filesChunks
      .getFiles()
      .find(({ Key: fileKey }) => fileKey === Key);
    chunkPath = `CHUNK_${chunkIndex}/`;
  }

  if (label) {
    return `${chunkPath}${root}${prefix}${label}.${extension}`;
  }

  if (adminName) {
    return `${chunkPath}${root}${prefix}${adminName}.${extension}`;
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
    ? `${chunkPath}${root}${prefix}${
      name.split('.').slice(0, -1)[0]
    }${suffix}.${extension}`
    : `${chunkPath}${root}${prefix}${Intl.formatMessage({
      id: `files.${documentId}`,
    })}${suffix}.${extension}`;
};

const makeFormatFileName = ({
  root,
  additionalDocuments,
  prefix,
  filesChunks,
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
    options,
    filesChunks,
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
  filesChunks,
}) => {
  const { _id: docId, additionalDocuments = [], documents: docDocuments } = doc;
  const filteredDocuments = filterDocuments(
    docDocuments,
    docId,
    documents,
    options,
  );
  zipDocuments({
    zip,
    documents: filteredDocuments,
    options,
    formatFileName: makeFormatFileName({
      root: root(doc),
      additionalDocuments,
      prefix: prefix(doc),
      filesChunks,
      options,
    }),
  });
};

export const generateLoanZip = ({ zip, loan, documents, options, res }) => {
  const { properties = [], borrowers = [], structure = {} } = loan;
  res.writeHead(200, {
    'Content-Disposition': `attachment; filename=${loan.name}.zip`,
  });
  zip.pipe(res);

  const { splitInChunks } = options;

  const filesChunks = new FilesChunksManager();

  if (splitInChunks) {
    splitFilesInChunks({
      docs: [
        loan,
        properties.find(({ _id }) => _id === structure.propertyId),
        ...borrowers,
      ],
      filesChunks,
      options,
    });
  }

  // Zip loan files
  zipDocFiles({
    zip,
    doc: loan,
    documents,
    options,
    root: ({ name }) => `${name}/`,
    filesChunks,
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
      filesChunks,
    }));

  // Zip propterty files
  zipDocFiles({
    zip,
    doc: properties.find(({ _id }) => _id === structure.propertyId),
    documents,
    options,
    root: ({ address1 }) => `${address1}/`,
    prefix: ({ address1 }) => `${address1} `,
    filesChunks,
  });

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
    });

    generateLoanZip({ zip, loan, documents, options, res });
  });
  return Promise.resolve(RESPONSE_ALREADY_SENT);
};

export default zipLoan;
