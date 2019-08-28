import archiver from 'archiver';

import Intl from 'core/utils/server/intl';
import LoanService from '../../../../loans/server/LoanService';
import { zipDocuments } from './zipHelpers';
import {
  DOCUMENTS,
  DOCUMENTS_CATEGORIES,
} from '../../../../files/fileConstants';
import { withMeteorUserId } from '../../helpers';

const getFileName = ({ Key, name, index, total, adminName, prefix }) => {
  const category = Key.split('/').slice(-2, -1)[0];
  const fileExtension = Key.split('.').slice(-1)[0];
  const suffix = total > 1 ? ` (${index + 1} sur ${total})` : '';
  if (adminName) {
    return `${adminName}.${fileExtension}`;
  }
  return category === DOCUMENTS.OTHER
    || !Object.keys(DOCUMENTS_CATEGORIES)
      .reduce(
        (allCategories, cat) => [
          ...allCategories,
          ...DOCUMENTS_CATEGORIES[cat].map(c => c),
        ],
        [],
      )
      .includes(category)
    ? `${prefix}${name.split('.').slice(0, -1)[0]}${suffix}.${fileExtension}`
    : `${prefix}${Intl.formatMessage({
      id: `files.${category}`,
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

const zipBorrowerFiles = (zip, borrowers) => {
  borrowers.forEach(({ documents = {}, firstName, lastName, name }) => {
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

    const { properties = [], borrowers = [], structure = {} } = loan;

    res.writeHead(200, {
      'Content-Disposition': `attachment; filename=${loan.name}.zip`,
    });
    zip.pipe(res);
    zipLoanFiles(zip, loan);
    zipBorrowerFiles(zip, borrowers);
    zipPropertyFiles(
      zip,
      properties.find(({ _id }) => _id === structure.propertyId),
    );
    zip.finalize();
  });
};

export default zipLoan;
