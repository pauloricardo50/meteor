import React, { useState } from 'react';
import cx from 'classnames';

import IconButton from 'core/components/IconButton/IconButton';
import LenderPickerOrganisationRules from './LenderPickerOrganisationRules';

const LenderPickerOrganisation = ({
  organisation,
  addLender,
  removeLender,
  isActive,
  loan,
}) => {
  const { name, _id: organisationId } = organisation;
  const [loading, setLoading] = useState(false);
  return (
    <div className="flex center organisation">
      <div className="organisation-detail">
        <h4 className={cx({ secondary: !isActive })}>{name}</h4>
        <LenderPickerOrganisationRules
          organisation={organisation}
          loan={loan}
        />
      </div>
      <IconButton
        className={isActive ? 'error remove' : 'add'}
        type={isActive ? 'delete' : 'add'}
        onClick={() => {
          setLoading(true);
          const promise = isActive
            ? removeLender(organisationId)
            : addLender(organisationId);
          return promise.finally(() => setLoading(false));
        }}
        loading={loading}
      />
    </div>
  );
};

export default LenderPickerOrganisation;
