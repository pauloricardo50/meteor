import React from 'react';

import {
  getMainOrganisation,
  getUserDisplayName,
} from '../../utils/userFunctions';
import Icon from '../Icon';

const AccountPageHeader = ({ currentUser }) => {
  const mainOrganisation = getMainOrganisation(currentUser);

  return (
    <div className="account-page-header">
      <Icon type="accountCircle" className="icon" />
      <h1>{getUserDisplayName(currentUser)}</h1>
      {mainOrganisation?._id && (
        <h3 className="secondary">{mainOrganisation.name}</h3>
      )}
    </div>
  );
};
export default AccountPageHeader;
