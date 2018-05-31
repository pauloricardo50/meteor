import React from 'react';
import PropTypes from 'prop-types';

import { loanUpdate } from 'core/api';
import { T } from 'core/components/Translation';
import Toggle from 'core/components/Material/Toggle';

const makeHandleForDisablingUserForms = ({
  _id: loanId,
  userFormsDisabled,
}) => (event, isToggledOn) => {
  loanUpdate.run({
    object: {
      userFormsDisabled: isToggledOn,
    },
    loanId,
  });
};

const DisableUserFormsToggle = ({ loan }) => {
  const { userFormsDisabled = false } = loan;

  return (
    <Toggle
      labelTop={<T id="DisableUserFormsToggle.canEdit" />}
      labelLeft={<T id="general.no" />}
      labelRight={<T id="general.yes" />}
      toggled={userFormsDisabled}
      onToggle={makeHandleForDisablingUserForms(loan)}
    />
  );
};

DisableUserFormsToggle.propTypes = {
  loan: PropTypes.object.isRequired,
};

export default DisableUserFormsToggle;
