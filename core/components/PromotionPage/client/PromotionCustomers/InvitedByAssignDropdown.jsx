import React from 'react';

import DropdownMenu from '../../../DropdownMenu';
import T from '../../../Translation';
import InvitedByAssignDropdownContainer from './InvitedByAssignDropdownContainer';

const InvitedByAssignDropdown = ({ options, invitedByName }) => (
  <div className="invitedBy-assign-dropdown">
    <DropdownMenu
      iconType="personAdd"
      options={options}
      tooltip={<T id="PromotionLotLoansTable.assignInvitedBy" />}
      buttonProps={{ size: 'small' }}
    />
    <span>{invitedByName}</span>
  </div>
);

export default InvitedByAssignDropdownContainer(InvitedByAssignDropdown);
