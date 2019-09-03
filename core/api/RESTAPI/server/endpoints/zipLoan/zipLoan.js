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
}) => {
  const fileExtension = Key.split('.').slice(-1)[0];

  if (adminName) {
    return `${prefix}${adminName}.${fileExtension}`;
  }

  const document = Key.split('/').slice(-2, -1)[0];
  const suffix = total > 1 ? ` (${index + 1} sur ${total})` : '';

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

const zipLoanFiles = (zip, { documents, name }) => {
  zipDocuments({
    zip,
    documents,
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
      });

      return `${name}/${filename}`;
    },
  });
};

const zipBorrowerFiles = (
  zip,
  { documents = {}, firstName, lastName, name },
) => {
  zipDocuments({
    zip,
    documents,
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
      });
      return `${name}/${fileName}`;
    },
  });
};

const zipPropertyFiles = (zip, { documents = {}, address1 } = {}) =>
  zipDocuments({
    zip,
    documents,
    formatFileName: ({ Key, name, adminname: adminName }, index, total) => {
      const prefix = `${address1} `;
      const fileName = getFileName({
        Key,
        name,
        adminName,
        index,
        total,
        prefix,
      });
      return `${address1}/${fileName}`;
    },
  });

export const generateLoanZip = (zip, loan, res) => {
  const { properties = [], borrowers = [], structure = {} } = loan;
  res.writeHead(200, {
    'Content-Disposition': `attachment; filename=${loan.name}.zip`,
  });
  zip.pipe(res);
  zipLoanFiles(zip, loan);
  borrowers.forEach(borrower => zipBorrowerFiles(zip, borrower));
  zipPropertyFiles(
    zip,
    properties.find(({ _id }) => _id === structure.propertyId),
  );
  zip.finalize();
};

const zipLoan = ({ res, query: { 'loan-id': loanId, 'user-id': userId } }) => {
  withMeteorUserId({ userId }, () => {
    const zip = new archiver.create('zip');

    const loan = LoanService.fetchOne({
      $filters: { _id: loanId },
      borrowers: { firstName: 1, lastName: 1, name: 1, documents: 1 },
      properties: { address1: 1, documents: 1 },
      structure: 1,
      documents: 1,
      name: 1,
    });

    generateLoanZip(zip, loan, res);
  });
  return Promise.resolve(RESPONSE_ALREADY_SENT);
};

export default zipLoan;
