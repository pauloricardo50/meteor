import React from 'react';
import PropTypes from 'prop-types';

import { disableUserForms, enableUserForms } from 'core/api';
import { T } from 'core/components/Translation';
import Toggle from 'core/components/Material/Toggle';

const makeHandleForDisablingUserForms = ({ _id: loanId }) => (
  event,
  isToggledOn,
) =>
  isToggledOn
    ? enableUserForms.run({ loanId })
    : disableUserForms.run({ loanId });

const DisableUserFormsToggle = ({ loan }) => {
  const { userFormsEnabled } = loan;

  return (
    <Toggle
      labelTop={<T id="DisableUserFormsToggle.canEdit" />}
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
