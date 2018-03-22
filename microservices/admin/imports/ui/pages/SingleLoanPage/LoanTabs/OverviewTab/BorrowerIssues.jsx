import React from 'react';
import { T } from 'core/components/Translation';
import IssuesFilesList from './IssuesFilesList';
import IssuesFieldsList from './IssuesFieldsList';

export default ({ borrowers, checkFileErrors }) => {
  const borrowersAdminValidation = [];

  borrowers.map((borrower, i) =>
    borrowersAdminValidation.push({
      borrowerName:
        borrower.firstName || borrower.lastName
          ? `${borrower.firstName} ${borrower.lastName}`
          : `Emprunteur ${i + 1}`,
      fieldsIssues: (
        <IssuesFieldsList adminValidation={borrower.adminValidation} />
      ),
      fileIssues: (
        <IssuesFilesList
          documents={borrower.documents}
          checkFileErrors={checkFileErrors}
        />
      ),
    }));

  return (
    borrowersAdminValidation.length > 0 && (
      <div>
        <h4 className="bold">
          <T id="collections.borrowers" />
        </h4>
        {borrowersAdminValidation.map(borrower => (
          <div key={borrower._id}>
            <p className="bold">{borrower.borrowerName}</p>
            {borrower.fieldsIssues}
            {borrower.fileIssues}
          </div>
        ))}
      </div>
    )
  );
};
