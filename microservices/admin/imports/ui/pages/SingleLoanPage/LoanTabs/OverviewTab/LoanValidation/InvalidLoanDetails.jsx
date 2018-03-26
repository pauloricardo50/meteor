import React from 'react';
import PropTypes from 'prop-types';
import { T, IntlDate } from 'core/components/Translation';
import { FILE_STATUS } from 'core/api/files/fileConstants';
import BorrowersIssues from './BorrowerIssues';
import DocErrorsDetails from './DocErrorDetails';

const hasFileErrors = fileArray =>
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
        <T id="LoanValidation.invalidatedAt" />
        &nbsp;
        <IntlDate
          value={verifiedAt}
          month="numeric"
          year="numeric"
          day="2-digit"
          hour="2-digit"
          minute="2-digit"
        />
      </h2>
      <ul>
        {hasLoanIssues && (
          <DocErrorsDetails
            translationId="general.loan"
            adminValidation={adminValidation}
            documents={documents}
            hasFileErrors={hasFileErrors}
          />
        )}

        {hasBorrowersIssues && (
          <BorrowersIssues
            borrowers={borrowers}
            hasFileErrors={hasFileErrors}
          />
        )}

        {hasPropertyIssues && (
          <DocErrorsDetails
            translationId="general.property"
            adminValidation={property.adminValidation}
            documents={property.documents}
            hasFileErrors={hasFileErrors}
          />
        )}
      </ul>
    </div>
  );
};

InvalidLoanDetails.propTypes = {
  loan: PropTypes.object.isRequired,
};

InvalidLoanDetails.defaultProps = {};

export default InvalidLoanDetails;
