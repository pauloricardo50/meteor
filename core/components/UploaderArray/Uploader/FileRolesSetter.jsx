import { Meteor } from 'meteor/meteor';

import React, { useContext } from 'react';

import { FILE_ROLES } from '../../../api/files/fileConstants';
import { getFileRolesArray } from '../../../api/files/fileHelpers';
import DropdownMenu from '../../DropdownMenu';
import IconButton from '../../IconButton';
import { ModalManagerContext } from '../../ModalManager';
import ConfirmModal from '../../ModalManager/ConfirmModal';
import T from '../../Translation';

const getIconProps = roles => {
  if (roles.includes(FILE_ROLES.ADMIN)) {
    return {
      type: 'lock',
      iconProps: { color: 'error' },
      tooltip: <T defaultMessage="Document accessible uniquement aux Admins" />,
    };
  }

  if (roles.includes(FILE_ROLES.PRO)) {
    return {
      type: 'lock',
      iconProps: { color: 'warning' },
      tooltip: <T defaultMessage="Document accessible uniquement aux Pros" />,
    };
  }

  return { type: 'lockOpen', tooltip: <T defaultMessage="Document public" /> };
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
