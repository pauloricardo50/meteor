import React from 'react';
import { faHome } from '@fortawesome/pro-light-svg-icons/faHome';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Loans from '../../api/loans';
import T from '../Translation';
import UpdateField from '../UpdateField';

const ResidenceTypeSetter = ({
  loan,
  image,
  onSubmitCallback,
  noIcon = false,
  text = <T id="Forms.propertyPage.residenceTypeSetter.text" />,
}) => {
  const { residenceType } = loan;
  return (
    <div className="card1 residence-type-setter">
      <FontAwesomeIcon className="icon" icon={faHome} />
      <div className="flex-col">
        {!residenceType && <p>{text}</p>}
        <UpdateField
          doc={loan}
          fields={['residenceType']}
          collection={Loans}
          className="residence-type-setter-dropdown"
          onSubmitCallback={onSubmitCallback}
        />
      </div>
    </div>
  );
};

export default ResidenceTypeSetter;
