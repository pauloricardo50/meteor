import React from 'react';
import PropTypes from 'prop-types';
import { T, IntlDate } from 'core/components/Translation';
import InvalidLoanDetails from './InvalidLoanDetails';
import ValidationTemplate from './ValidationTemplate';

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
      <ValidationTemplate
        className="fixed-size bold"
        labelId="validatedAt"
        date={verifiedAt}
      />
    );
  } else if (requested) {
    return (
      <ValidationTemplate
        className="fixed-size bold warning"
        labelId="requestedAt"
        date={requestedAt}
      />
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

export default LoanValidation;
