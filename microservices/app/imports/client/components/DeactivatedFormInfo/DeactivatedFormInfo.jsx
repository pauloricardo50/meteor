import React, { useContext } from 'react';

import Icon from 'core/components/Icon';
import T from 'core/components/Translation';
import { ContactButtonContext } from 'core/components/ContactButton/ContactButtonContext';

const DeactivatedFormInfo = ({ loan: { userFormsEnabled }, style }) => {
  const { toggleOpenContact } = useContext(ContactButtonContext);
  if (userFormsEnabled) {
    return null;
  }

  return (
    <div className="deactivated-form-info" style={style}>
      <a
        className="deactivated-form-info-box"
        target="_blank"
        onClick={event => {
          event.stopPropagation();
          event.preventDefault();
          toggleOpenContact();
        }}
      >
        <Icon type="info" className="icon" />
        <span>
          <T id="DeactivatedFormInfo.description" />
        </span>
      </a>
    </div>
  );
};

export default DeactivatedFormInfo;
