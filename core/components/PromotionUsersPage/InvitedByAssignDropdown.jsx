// @flow
import React from 'react';

import DropdownMenu from 'core/components/DropdownMenu';
import T from 'core/components/Translation';
import InvitedByAssignDropdownContainer from './InvitedByAssignDropdownContainer';

type InvitedByAssignDropdownProps = {};

const InvitedByAssignDropdown = ({
  options,
  invitedByName,
}: InvitedByAssignDropdownProps) => (
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
