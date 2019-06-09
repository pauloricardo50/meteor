import React from 'react';
import PropTypes from 'prop-types';

import { loanUpdate } from 'core/api/methods';
import { T } from 'core/components/Translation';
import Toggle from 'core/components/Toggle';

const makeHandleForDisablingUserForms = ({ _id: loanId }) => (
  event,
  isToggledOn,
) => loanUpdate.run({ loanId, object: { userFormsEnabled: isToggledOn } });

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
