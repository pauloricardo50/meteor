import archiver from 'archiver';

import Intl from 'core/utils/server/intl';
import LoanService from '../../../../loans/server/LoanService';
import { zipDocuments } from './zipHelpers';
import {
  DOCUMENTS,
  DOCUMENTS_CATEGORIES,
} from '../../../../files/fileConstants';

const getFileName = ({ Key, name, index, total }) => {
  const category = Key.split('/').slice(-2, -1)[0];
  const fileExtension = Key.split('.').slice(-1)[0];
  const suffix = total > 1 ? ` (${index + 1} sur ${total})` : '';
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
    ? `${name.split('.').slice(0, -1)[0]}${suffix}.${name.split('.').slice(-1)}`
    : `${Intl.formatMessage({
      id: `files.${category}`,
    })}${suffix}.${fileExtension}`;
};

const zipLoanFiles = (zip, { documents, name }) => {
  zipDocuments({
    zip,
    documents,
    formatFileName: ({ name: originalName, Key }, index, total) => {
      const filename = getFileName({
        Key,
        name: originalName,
        index,
        total,
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
      formatFileName: ({ Key, name: originalName }, index, total) => {
        const initials = `${firstName.toUpperCase()[0]}${
          lastName.toUpperCase()[0]
        }`;
        const fileName = getFileName({ Key, name: originalName, index, total });
        return `${name}/${initials} ${fileName}`;
      },
    });
  });
};

const zipPropertyFiles = (zip, { documents = {}, address1 } = {}) =>
  zipDocuments({
    zip,
    documents,
    formatFileName: ({ Key, name }, index, total) =>
      `${address1}/${address1} ${getFileName({ Key, name, index, total })}`,
  });

const zipLoan = ({ res, query: { 'loan-id': loanId } }) => {
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
};

export default zipLoan;
