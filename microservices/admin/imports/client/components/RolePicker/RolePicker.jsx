import React from 'react';

import SecurityService from 'core/api/security/Security';
import { setRole } from 'core/api/users/methodDefinitions';
import { ASSIGNABLE_ROLES, ROLES } from 'core/api/users/roles/roleConstants';
import DropdownMenu from 'core/components/DropdownMenu';
import T from 'core/components/Translation';

const RolePicker = ({ userId }) => {
  const roles = SecurityService.currentUserHasRole(ROLES.DEV)
    ? Object.values(ASSIGNABLE_ROLES)
    : Object.values(ASSIGNABLE_ROLES).filter(role => role !== ROLES.DEV);
  const onChooseRole = newRole => setRole.run({ userId, role: newRole });

  return (
    <DropdownMenu
      iconType="edit"
      options={roles.map(role => ({
        id: role,
        label: <T id={`roles.${role}`} />,
        onClick: () => onChooseRole(role),
      }))}
    />
  );
};

export default RolePicker;
