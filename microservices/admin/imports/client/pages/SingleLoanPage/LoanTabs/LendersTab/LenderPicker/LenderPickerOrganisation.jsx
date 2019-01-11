// @flow
import React from 'react';
import cx from 'classnames';

import IconButton from 'imports/core/components/IconButton/IconButton';

type LenderPickerOrganisationProps = {};

const LenderPickerOrganisation = ({
  organisation: { name, _id: organisationId },
  addLender,
  removeLender,
  isActive,
}: LenderPickerOrganisationProps) => (
  <div className="flex center organisation">
    <h4 className={cx({ secondary: !isActive })}>{name}</h4>
    {isActive && (
      <IconButton
        className="error"
        onClick={() => removeLender(organisationId)}
        type="delete"
      />
    )}
    {!isActive && (
      <IconButton onClick={() => addLender(organisationId)} type="add" />
    )}
  </div>
);

export default LenderPickerOrganisation;
