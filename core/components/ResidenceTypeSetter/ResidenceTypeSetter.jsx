// @flow
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/pro-light-svg-icons/faHome';

import { COLLECTIONS } from 'core/api/constants';
import UpdateField from '../UpdateField';
import T from '../Translation';

type ResidenceTypeSetterProps = {
  loan: Object,
};

const ResidenceTypeSetter = ({
  loan,
  image,
  onSubmitCallback,
  noIcon = false,
}: ResidenceTypeSetterProps) => {
  const { residenceType } = loan;
  return (
    <div className="card1 residence-type-setter">
      {image ? (
        <img src={image} />
      ) : noIcon ? null : (
        <FontAwesomeIcon className="icon" icon={faHome} />
      )}
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
          onSubmitCallback={onSubmitCallback}
        />
      </div>
    </div>
  );
};

export default ResidenceTypeSetter;
