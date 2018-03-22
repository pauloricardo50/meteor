import React from 'react';
import PropTypes from 'prop-types';
import { T, IntlDate } from 'core/components/Translation';
import BorrowersIssues from './BorrowerIssues';
import IssuesFieldsList from './IssuesFieldsList';
import IssuesFilesList from './IssuesFilesList';

const checkFileErrors = (fileArray) => {
  let error = false;
  fileArray.map((file) => {
    if (file.error && file.error !== '') {
      error = true;
    }
    return file;
  });
  return error;
};

const LoanValidation = ({ loan }) => {
  const { logic, adminValidation, documents, borrowers, property } = loan;
  const { requested, requestedAt, validated, verifiedAt } = logic.verification;

  const loanIssues =
    (adminValidation && Object.keys(adminValidation).length > 0) ||
    (documents && checkFileErrors(documents));
  const borrowersIssues = borrowers.map((borrower) => {
    if (
      borrower.adminValidation &&
      Object.keys(borrower.adminValidation).length > 0
    ) {
      return true;
    }
    if (borrower.documents && checkFileErrors(borrower.documents)) {
      return true;
    }
    return false;
  });
  const propertyIssues =
    (property.adminValidation &&
      Object.keys(property.adminValidation).length > 0) ||
    (property.documents && checkFileErrors(property.documents));

  if (validated === undefined && requested === undefined) {
    return (
      <h2 className="fixed-size bold">
        <T id="LoanValidation.notYetRequested" />
      </h2>
    );
  }

  if (validated) {
    return (
      <h2 className="fixed-size bold">
        <T id="LoanValidation.validatedOn" />
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
    );
  } else if (requested) {
    return (
      <h2 className="fixed-size bold warning">
        <T id="LoanValidation.requestedOn" />
        &nbsp;
        <IntlDate
          value={requestedAt}
          month="numeric"
          year="numeric"
          day="2-digit"
          hour="2-digit"
          minute="2-digit"
        />
      </h2>
    );
  }

  if (validated === false && requested === false) {
    return (
      <div>
        <hr />
        <h2 className="fixed-size bold error">
          <T id="LoanValidation.invalidatedOn" />
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
          {loanIssues && (
            <div>
              <h4 className="bold">
                <T id="general.loan" />
              </h4>
              <IssuesFieldsList adminValidation={adminValidation} />
              <IssuesFilesList
                documents={documents}
                checkFileErrors={checkFileErrors}
              />
            </div>
          )}

          {borrowersIssues && (
            <BorrowersIssues
              borrowers={borrowers}
              checkFileErrors={checkFileErrors}
            />
          )}

          {propertyIssues && (
            <div>
              <h4 className="bold">
                <T id="general.property" />
              </h4>
              <IssuesFieldsList adminValidation={property.adminValidation} />
              <IssuesFilesList
                documents={property.documents}
                checkFileErrors={checkFileErrors}
              />
            </div>
          )}
        </ul>
      </div>
    );
  }
  return null;
};

LoanValidation.propTypes = {
  loan: PropTypes.object.isRequired,
};

LoanValidation.defaultProps = {};

export default LoanValidation;
