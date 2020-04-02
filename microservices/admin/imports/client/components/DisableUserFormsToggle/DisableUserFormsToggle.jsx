import React from 'react';
import PropTypes from 'prop-types';

import { loanUpdate } from 'core/api/loans/methodDefinitions';
import Toggle from 'core/components/Toggle';
import { T } from 'core/components/Translation';

const makeHandleForDisablingUserForms = ({ _id: loanId }) => value =>
  loanUpdate.run({ loanId, object: { userFormsEnabled: value } });

const DisableUserFormsToggle = ({ loan }) => {
  const { userFormsEnabled } = loan;

  return (
    <Toggle
      labelTop={<T id="Forms.userFormsEnabled" />}
      labelLeft={<T id="general.no" />}
      labelRight={<T id="general.yes" />}
      toggled={userFormsEnabled}
      onToggle={makeHandleForDisablingUserForms(loan)}
    />
  );
};

DisableUserFormsToggle.propTypes = {
  loan: PropTypes.object.isRequired,
};

export default DisableUserFormsToggle;
