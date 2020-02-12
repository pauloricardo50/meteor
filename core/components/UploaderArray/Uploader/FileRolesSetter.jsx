import { Meteor } from 'meteor/meteor';
import React, { useContext } from 'react';

import DropdownMenu from '../../DropdownMenu';
import ConfirmModal from '../../ModalManager/ConfirmModal';
import { FILE_ROLES } from '../../../api/constants';
import T from '../../Translation';
import IconButton from '../../IconButton';
import { ModalManagerContext } from '../../ModalManager';
import { getFileRolesArray } from '../../../api/files/fileHelpers';

const getIconProps = roles => {
  if (roles.includes(FILE_ROLES.ADMIN)) {
    return {
      type: 'lock',
      iconProps: { color: 'error' },
      tooltip: <T id="File.roles.admin" />,
    };
  }

  if (roles.includes(FILE_ROLES.PRO)) {
    return {
      type: 'lock',
      iconProps: { color: 'warning' },
      tooltip: <T id="File.roles.pro" />,
    };
  }

  return { type: 'lockOpen', tooltip: <T id="File.roles.public" /> };
};

const getOptions = roles => {
  const hasNoRole = !roles.length;
  const authorizedRoles = hasNoRole
    ? [FILE_ROLES.PRO, FILE_ROLES.ADMIN]
    : [FILE_ROLES.PUBLIC, FILE_ROLES.PRO, FILE_ROLES.ADMIN];

  return authorizedRoles.filter(role => !roles.includes(role));
};

const FileRolesSetter = ({
  Key,
  allowSetRoles = false,
  handleSetRoles,
  name,
  ...file
}) => {
  const { openModal } = useContext(ModalManagerContext);

  const roles = getFileRolesArray(file);

  if (!allowSetRoles) {
    return null;
  }

  return (
    <DropdownMenu
      noWrapper
      renderTrigger={({ handleOpen }) => (
        <IconButton
          {...getIconProps(roles)}
          size="small"
          onClick={handleOpen}
        />
      )}
      options={getOptions(roles)
        .filter(x => x)
        .map(role => ({
          id: role,
          label: <T id={`File.roles.${role}.tooltip`} />,
          onClick: () => {
            openModal(
              <ConfirmModal
                func={() => handleSetRoles(Key, [role])}
                description={
                  <T
                    id={`File.roles.${role}.confirm`}
                    values={{
                      file: <b>{name}</b>,
                      withWarning: Meteor.microservice === 'pro',
                    }}
                  />
                }
              />,
            );
          },
        }))}
    />
  );
};

export default FileRolesSetter;
