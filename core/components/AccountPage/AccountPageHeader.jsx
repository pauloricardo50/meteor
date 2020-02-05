//
import React from 'react';

import { getUserDisplayName } from '../../utils/userFunctions';
import T from '../Translation';
import Icon from '../Icon';

const AccountPageHeader = ({ currentUser }) => {
  const { organisations } = currentUser;

  return (
    <div className="account-page-header">
      <Icon type="accountCircle" className="icon" />
      <h1>{getUserDisplayName(currentUser)}</h1>
      {organisations && organisations.length > 0 && (
        <h3 className="secondary">{organisations[0].name}</h3>
      )}
    </div>
  );
};
export default AccountPageHeader;
