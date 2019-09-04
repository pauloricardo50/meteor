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

export const getFileName = ({
  Key,
  name,
  index,
  total,
  adminName,
  prefix = '',
  additionalDocuments = [],
}) => {
  const fileExtension = Key.split('.').slice(-1)[0];

  const document = Key.split('/').slice(-2, -1)[0];

  const { label } = additionalDocuments.find(({ id }) => id === document) || {};

  if (label) {
    return `${prefix}${label}.${fileExtension}`;
  }

  if (adminName) {
    return `${prefix}${adminName}.${fileExtension}`;
  }

  const suffix = total > 1 && document !== DOCUMENTS.OTHER
    ? ` (${index + 1} sur ${total})`
    : '';

  return document === DOCUMENTS.OTHER
    || !Object.keys(DOCUMENTS_CATEGORIES)
      .reduce(
        (allCategories, cat) => [
          ...allCategories,
          ...DOCUMENTS_CATEGORIES[cat].map(c => c),
        ],
        [],
      )
      .includes(document)
    ? `${prefix}${name.split('.').slice(0, -1)[0]}${suffix}.${fileExtension}`
    : `${prefix}${Intl.formatMessage({
      id: `files.${document}`,
    })}${suffix}.${fileExtension}`;
};

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

const zipLoanFiles = ({
  zip,
  loan: { documents: loanDocuments, name, additionalDocuments = [], _id },
  documents,
  options,
}) => {
  const filteredDocuments = filterDocuments(
    loanDocuments,
    _id,
    documents,
    options,
  );
  zipDocuments({
    zip,
    documents: filteredDocuments,
    options,
    formatFileName: (
      { name: originalName, Key, adminname: adminName },
      index,
      total,
    ) => {
      const filename = getFileName({
        Key,
        name: originalName,
        index,
        total,
        adminName,
        additionalDocuments,
      });

      return `${name}/${filename}`;
    },
  });
};

const zipBorrowerFiles = ({
  zip,
  borrower: {
    documents: borrowerDocuments = {},
    firstName,
    lastName,
    name,
    additionalDocuments = [],
    _id,
  },
  documents,
  options,
}) => {
  const filteredDocuments = filterDocuments(
    borrowerDocuments,
    _id,
    documents,
    options,
  );
  zipDocuments({
    zip,
    documents: filteredDocuments,
    formatFileName: (
      { Key, name: originalName, adminname: adminName },
      index,
      total,
    ) => {
      const prefix = `${firstName.toUpperCase()[0]}${
        lastName.toUpperCase()[0]
      } `;
      const fileName = getFileName({
        Key,
        name: originalName,
        adminName,
        index,
        total,
        prefix,
        additionalDocuments,
      });
      return `${name}/${fileName}`;
    },
    options,
  });
};

const zipPropertyFiles = ({
  zip,
  property: {
    documents: propertyDocuments = {},
    address1,
    additionalDocuments = [],
    _id,
  } = {},
  documents,
  options,
}) => {
  const filteredDocuments = filterDocuments(
    propertyDocuments,
    _id,
    documents,
    options,
  );
  zipDocuments({
    zip,
    documents: filteredDocuments,
    formatFileName: ({ Key, name, adminname: adminName }, index, total) => {
      const prefix = `${address1} `;
      const fileName = getFileName({
        Key,
        name,
        adminName,
        index,
        total,
        prefix,
        additionalDocuments,
      });
      return `${address1}/${fileName}`;
    },
    options,
  });
};

export const generateLoanZip = ({ zip, loan, documents, options, res }) => {
  const { properties = [], borrowers = [], structure = {} } = loan;
  res.writeHead(200, {
    'Content-Disposition': `attachment; filename=${loan.name}.zip`,
  });
  zip.pipe(res);
  zipLoanFiles({ zip, loan, documents, options });
  borrowers.forEach(borrower =>
    zipBorrowerFiles({ zip, borrower, documents, options }));
  zipPropertyFiles({
    zip,
    property: properties.find(({ _id }) => _id === structure.propertyId),
    documents,
    options,
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
