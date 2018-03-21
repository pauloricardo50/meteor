import React from 'react';
import PropTypes from 'prop-types';
import List, { ListItem, ListItemText } from 'material-ui/List';
import { T, IntlDate } from 'core/components/Translation';
import BorrowersIssues from './BorrowerIssues';
import IssuesList from './IssuesList';

const LoanValidation = ({ loan }) => {
  const { logic, adminValidation, borrowers, property } = loan;
  const {
    requested,
    requestedTime,
    validated,
    validatedAt,
  } = logic.verification;

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
          value={validatedAt}
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
          value={requestedTime}
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
            value={validatedAt}
            month="numeric"
            year="numeric"
            day="2-digit"
            hour="2-digit"
            minute="2-digit"
          />
        </h2>
        <ul>
          {adminValidation &&
            Object.keys(adminValidation).length > 0 && (
              <div>
                <p className="bold">
                  <T id="general.loan" />
                </p>
                <IssuesList adminValidation />
              </div>
            )}
          <BorrowersIssues borrowers={borrowers} />
          {property.adminValidation &&
            Object.keys(property.adminValidation).length > 0 && (
              <div>
                <p className="bold">
                  <T id="general.property" />
                </p>
                <IssuesList adminValidation={property.adminValidation} />
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
