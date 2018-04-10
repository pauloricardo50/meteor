import React from 'react';
import PropTypes from 'prop-types';

import DropdownMenu from 'core/components/DropdownMenu';
import { T } from 'core/components/Translation';
import { ROLES } from 'core/api/constants';
import RolePickerContainer from './RolePickerContainer';

const RolePicker = ({ onChooseRole, shouldDisplay }) =>
  (shouldDisplay ? (
    <DropdownMenu
      iconType="edit"
      options={Object.values(ROLES).map(role => ({
        id: role,
        label: <T id={`roles.${role}`} />,
        onClick: () => onChooseRole(role),
      }))}
    />
  ) : null);

RolePicker.propTypes = {
  shouldDisplay: PropTypes.bool.isRequired,
  onChooseRole: PropTypes.func.isRequired,
};

export default RolePickerContainer(RolePicker);
