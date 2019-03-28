// @flow
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/pro-light-svg-icons/faHome';

import { COLLECTIONS } from 'core/api/constants';
import UpdateField from 'core/components/UpdateField';
import T from 'core/components/Translation';

type ResidenceTypeSetterProps = {
  loan: Object,
};

const ResidenceTypeSetter = ({ loan }: ResidenceTypeSetterProps) => {
  const { residenceType } = loan;
  return (
    <div className="card1 residence-type-setter">
      <FontAwesomeIcon className="icon" icon={faHome} />
      <div className="flex-col">
        {!residenceType && (
          <p>
            <T id="Forms.propertyPage.residenceTypeSetter.text" />
          </p>
        )}
        <UpdateField
          doc={loan}
          fields={['residenceType']}
          collection={COLLECTIONS.LOANS_COLLECTION}
          className="residence-type-setter-dropdown"
        />
      </div>
    </div>
  );
};

export default ResidenceTypeSetter;
