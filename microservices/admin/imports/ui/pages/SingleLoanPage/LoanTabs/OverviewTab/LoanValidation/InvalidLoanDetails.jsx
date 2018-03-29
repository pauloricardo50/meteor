import React from 'react';
import PropTypes from 'prop-types';
import { FILE_STATUS } from 'core/api/files/fileConstants';
import FullDate from 'core/components/dateComponents/FullDate';
import BorrowersIssues from './BorrowerIssues';
import DocErrorsDetails from './DocErrorDetails';

export const hasFileErrors = fileArray =>
  fileArray.some(file => file.status === FILE_STATUS.ERROR);

const hasDocumentsErrors = documents =>
  Object.keys(documents).some((key) => {
    const { files } = documents[key];
    return hasFileErrors(files);
  });

const hasErrors = ({ adminValidation, documents }) =>
  (adminValidation && Object.keys(adminValidation).length > 0) ||
  (documents && hasDocumentsErrors(documents));

const InvalidLoanDetails = ({ loan }) => {
  const { logic, adminValidation, documents, borrowers, property } = loan;
  const { verifiedAt } = logic.verification;

  const hasLoanIssues = hasErrors({ adminValidation, documents });

  const hasBorrowersIssues = borrowers.some(borrower =>
    hasErrors({
      adminValidation: borrower.adminValidation,
      documents: borrower.documents,
    }));

  const hasPropertyIssues = hasErrors({
    adminValidation: property.adminValidation,
    documents: property.documents,
  });

  return (
    <div>
      <hr />
      <h2 className="fixed-size bold error">
        <FullDate translationId="invalidatedAt" date={verifiedAt} />
      </h2>
      <ul>
        {hasLoanIssues && (
          <DocErrorsDetails
            translationId="general.loan"
            adminValidation={adminValidation}
            documents={documents}
          />
        )}

        {hasBorrowersIssues && <BorrowersIssues borrowers={borrowers} />}

        {hasPropertyIssues && (
          <DocErrorsDetails
            translationId="general.property"
            adminValidation={property.adminValidation}
            documents={property.documents}
          />
        )}
      </ul>
    </div>
  );
};

InvalidLoanDetails.propTypes = {
  loan: PropTypes.object.isRequired,
};

export default InvalidLoanDetails;
