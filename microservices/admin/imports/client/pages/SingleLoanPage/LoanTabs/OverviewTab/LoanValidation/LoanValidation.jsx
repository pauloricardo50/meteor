import React from 'react';
import PropTypes from 'prop-types';
import T from 'core/components/Translation';
import InvalidLoanDetails from './InvalidLoanDetails';
import ValidationTemplate from './ValidationTemplate';

const isBeforeFirstRequest = (validated, requested) =>
  validated === undefined && requested === undefined;

const isInvalidated = (validated, requested) =>
  validated === false && requested === false;

const LoanValidation = ({ loan }) => {
  const { logic } = loan;

  if (!logic) {
    console.warn('Inside LoanValidation we could not find logic', {
      loan,
      now: new Date(),
    }); // eslint-disable-line
    return null;
  }

  const { requested, requestedAt, validated, verifiedAt } = logic.verification;

  if (isBeforeFirstRequest(validated, requested)) {
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

  if (isInvalidated(validated, requested)) {
    return <InvalidLoanDetails loan={loan} />;
  }

  return null;
};

LoanValidation.propTypes = {
  loan: PropTypes.object.isRequired,
};

export default LoanValidation;
