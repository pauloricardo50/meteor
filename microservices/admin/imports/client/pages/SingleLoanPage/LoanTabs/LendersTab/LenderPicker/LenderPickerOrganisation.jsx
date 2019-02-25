// @flow
import React from 'react';
import cx from 'classnames';

import IconButton from 'core/components/IconButton/IconButton';
import LenderPickerOrganisationRules from './LenderPickerOrganisationRules';

type LenderPickerOrganisationProps = {
  organisation: Object,
  addLender: Function,
  removeLender: Function,
  isActive: boolean,
};

const LenderPickerOrganisation = ({
  organisation,
  addLender,
  removeLender,
  isActive,
  loan,
}: LenderPickerOrganisationProps) => {
  const { name, _id: organisationId } = organisation;
  return (
    <div className="flex center organisation">
      <div className="flex-col">
        <h4 className={cx({ secondary: !isActive })}>{name}</h4>
        <LenderPickerOrganisationRules
          organisation={organisation}
          loan={loan}
        />
      </div>
      {isActive && (
        <IconButton
          className="error remove"
          onClick={() => removeLender(organisationId)}
          type="delete"
        />
      )}
      {!isActive && (
        <IconButton
          onClick={() => addLender(organisationId)}
          type="add"
          className="add"
        />
      )}
    </div>
  );
};

export default LenderPickerOrganisation;
