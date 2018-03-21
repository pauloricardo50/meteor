import React from 'react';
import { T } from 'core/components/Translation';
import IssuesList from './IssuesList';

export default ({ borrowers }) => {
  const borrowersAdminValidation = [];

  borrowers.map((borrower, i) =>
    borrowersAdminValidation.push({
      borrowerName:
        borrower.firstName || borrower.lastName
          ? `${borrower.firstName} ${borrower.lastName}`
          : `Emprunteur ${i + 1}`,
      issues: <IssuesList adminValidation={borrower.adminValidation} />,
    }));

  return (
    borrowersAdminValidation.length > 0 && (
      <div>
        <p className="bold">
          <T id="collections.borrowers" />
        </p>
        {borrowersAdminValidation.map(borrower => (
          <div key={borrower._id}>
            <p className="bold">{borrower.borrowerName}</p>
            {borrower.issues}
          </div>
        ))}
      </div>
    )
  );
};
