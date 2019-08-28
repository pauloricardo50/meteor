import archiver from 'archiver';

import LoanService from '../../../../loans/server/LoanService';
import { zipDocuments } from './zipHelpers';

const zipLoanFiles = (zip, { documents }) => {
  zipDocuments({ zip, documents, formatFileName: ({ name }) => name });
};

const zipBorrowerFiles = (zip, borrowers) => {
  borrowers.forEach(({ documents = {}, firstName = 'bob', lastName = 'ross' }) => {
    zipDocuments({
      zip,
      documents,
      formatFileName: ({ name }) => {
        const initials = `${firstName[0]}${lastName[0]}`;
        return `${initials} ${name}`;
      },
    });
  });
};

const zipPropertyFiles = (zip, { documents = {} } = {}) =>
  zipDocuments({ zip, documents, formatFileName: ({ name }) => name });

const zipLoan = ({ res, query: { 'loan-id': loanId } }) => {
  const zip = new archiver.create('zip');

  const loan = LoanService.fetchOne({
    $filters: { _id: loanId },
    borrowers: { firstName: 1, lastName: 1, documents: 1 },
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
