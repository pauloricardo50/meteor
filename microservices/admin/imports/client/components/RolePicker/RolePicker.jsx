import React from 'react';
import PropTypes from 'prop-types';

import DropdownMenu from 'core/components/DropdownMenu';
import T from 'core/components/Translation';

import RolePickerContainer from './RolePickerContainer';

const RolePicker = ({ onChooseRole, roles }) => (
  <DropdownMenu
    iconType="edit"
    options={roles.map(role => ({
      id: role,
      label: <T id={`roles.${role}`} />,
      onClick: () => onChooseRole(role),
    }))}
  />
);

RolePicker.propTypes = {
  onChooseRole: PropTypes.func.isRequired,
  roles: PropTypes.array.isRequired,
};

export default RolePickerContainer(RolePicker);
