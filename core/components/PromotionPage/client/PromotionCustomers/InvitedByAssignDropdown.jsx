import React from 'react';

import DropdownMenu from '../../../DropdownMenu';
import T from '../../../Translation';
import InvitedByAssignDropdownContainer from './InvitedByAssignDropdownContainer';

const InvitedByAssignDropdown = ({ options, invitedByName }) => (
  <div className="invitedBy-assign-dropdown">
    <span>{invitedByName}</span>
    <DropdownMenu
      iconType="personAdd"
      options={options}
      tooltip={<T id="PromotionLotLoansTable.assignInvitedBy" />}
    />
  </div>
);

export default InvitedByAssignDropdownContainer(InvitedByAssignDropdown);
