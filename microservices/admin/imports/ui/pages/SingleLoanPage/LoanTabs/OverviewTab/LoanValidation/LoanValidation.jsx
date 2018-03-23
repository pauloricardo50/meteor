import React from 'react';
import PropTypes from 'prop-types';
import { T, IntlDate } from 'core/components/Translation';
import InvalidLoanDetails from './InvalidLoanDetails';

const LoanValidation = ({ loan }) => {
  const { logic } = loan;
  const { requested, requestedAt, validated, verifiedAt } = logic.verification;

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
        <T id="LoanValidation.validatedAt" />
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
        <T id="LoanValidation.requestedAt" />
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
    return <InvalidLoanDetails loan={loan} />;
  }

  return null;
};

LoanValidation.propTypes = {
  loan: PropTypes.object.isRequired,
};

LoanValidation.defaultProps = {};

export default LoanValidation;
