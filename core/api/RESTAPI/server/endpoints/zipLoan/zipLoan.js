import archiver from 'archiver';

import { LoanService } from '../../../../loans/server/LoanService';
import { zipDocuments } from './zipHelpers';

const zipLoanFiles = (zip, { documents }) =>
  zipDocuments({ zip, documents, formatFileName: ({ name }) => name });

const zipBorrowerFiles = (zip, borrowers) =>
  Promise.all(borrowers.map(({ documents, firstName, lastName }) =>
    zipDocuments({
      zip,
      documents,
      formatFileName: ({ name }) => {
        const initials = firstName[0] + lastName[0];

        return `${initials}_${name}`;
      },
    })));

const zipPropertyFiles = (zip, { documents }) =>
  zipDocuments({ zip, documents, formatFileName: ({ name }) => name });

const zipLoan = (
  { user: { _id: userId }, body: { loanId } },
  { req, res, next },
) => {
  const zip = new archiver.create('zip');
  zip.pipe(res);

  const loan = LoanService.fetchOne({
    $filters: { _id: loanId },
    borrowers: { firstName: 1, lastName: 1, documents: 1 },
    properties: { address1: 1, documents: 1 },
    structure: 1,
    documents: 1,
  });

  zipLoanFiles(zip, loan)
    .then(() => zipBorrowerFiles(zip, loan.borrowers))
    .then(() =>
      zipPropertyFiles(
        zip,
        loan.properties.find(({ _id }) => _id === loan.structure.propertyId),
      ))
    .then(() => zip.finalize());
};

export default zipLoan;
