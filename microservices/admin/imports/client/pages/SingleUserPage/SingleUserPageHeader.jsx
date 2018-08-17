import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';

import T from 'core/components/Translation';
import Icon from 'core/components/Icon';
import Roles from 'core/components/Roles';
import ImpersonateLink from 'core/components/Impersonate/ImpersonateLink';
import RolePicker from '../../components/RolePicker';
import EditUserFormDialog from './EditUserDialogForm';
import UserAssignDropdown from '../../components/AssignAdminDropdown/UserAssignDropdown';

const SingleUserPageHeader = ({ user }) => {
  const { _id, assignedEmployee, createdAt, roles, phoneNumbers, name } = user;

  return (
    <div className="single-user-page-header">
      <div className="top">
        <h1>
          {name}

          <small className="secondary">
            &nbsp;-&nbsp;
            <Roles roles={roles} />
          </small>

          <RolePicker userId={_id} />
        </h1>

        <EditUserFormDialog user={user} />

        <ImpersonateLink user={user} className="impersonate-link" />
      </div>

      <div className="bottom">
        {!!(phoneNumbers && phoneNumbers.length) && (
          <div className="phone">
            <Icon type="phone" />{' '}
            {phoneNumbers.map(number => (
              <a key={number} href={`tel:${number}`}>
                {number}
              </a>
            ))}
          </div>
        )}

        <p className="secondary created-at">
          <T id="UsersTable.createdAt" />{' '}
          {moment(createdAt).format('D MMM YY à HH:mm:ss')}
        </p>

        {assignedEmployee ? (
          <div className="assigned-employee">
            <p>
              <T id="UsersTable.assignedTo" /> {assignedEmployee.name}
            </p>
            <UserAssignDropdown doc={user} />
          </div>
        ) : (
          <UserAssignDropdown doc={user} />
        )}
      </div>
    </div>
  );
};

SingleUserPageHeader.propTypes = {
  user: PropTypes.object.isRequired,
};

export default SingleUserPageHeader;
