import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';

import T from 'core/components/Translation';
import Icon from 'core/components/Icon';
import Roles from 'core/components/Roles';
import ImpersonateLink from 'core/components/Impersonate/ImpersonateLink';
import { getUserDisplayName } from 'core/utils/userFunctions';
import RolePicker from '../../components/RolePicker';
import EditUserFormDialog from './EditUserDialogForm';

const SingleUserPageHeader = ({ user }) => {
  const {
    _id,
    assignedEmployee,
    createdAt,
    emails,
    firstName,
    lastName,
    username,
    roles,
    phoneNumbers,
  } = user;

  return (
    <div className="single-user-page-header">
      <div className="top">
        <h1>
          {getUserDisplayName({ firstName, lastName, username, emails })}
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
        <div className="phone">
          <Icon type="phone" /> {phoneNumbers}
        </div>
        <p className="secondary created-at">
          <T id="UsersTable.createdAt" />{' '}
          {moment(createdAt).format('D MMM YY à HH:mm:ss')}
        </p>
        {assignedEmployee && (
          <p>
            &nbsp; - &nbsp;
            <T id="UsersTable.assignedTo" />{' '}
            {getUserDisplayName({
              firstName: assignedEmployee.firstName,
              lastName: assignedEmployee.lastName,
              username: assignedEmployee.username,
              emails: assignedEmployee.emails,
            })}
          </p>
        )}
      </div>
    </div>
  );
};

SingleUserPageHeader.propTypes = {
  user: PropTypes.object.isRequired,
};

export default SingleUserPageHeader;
