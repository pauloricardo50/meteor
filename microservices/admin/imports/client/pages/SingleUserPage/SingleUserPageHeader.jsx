import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';

import T from 'core/components/Translation';
import Roles from 'core/components/Roles';
import ImpersonateLink from 'core/components/Impersonate/ImpersonateLink';
import { getUserFullName } from 'core/utils/userFunctions';
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
    roles,
  } = user;

  return (
    <div className="single-user-page-header">
      <div className="top">
        <h1>
          {getUserFullName({ firstName, lastName }) || emails[0].address}
          <small className="secondary">
            &nbsp;-&nbsp;<Roles roles={roles} />
          </small>
          <RolePicker userId={_id} />
        </h1>
        <EditUserFormDialog user={user} />
        <ImpersonateLink user={user} className="impersonate-link" />
      </div>

      <div className="bottom">
        <p className="secondary created-at">
          <T id="UsersTable.createdAt" />{' '}
          {moment(createdAt).format('D MMM YY à HH:mm:ss')}
        </p>

        {assignedEmployee && (
          <p>
            &nbsp; - &nbsp;
            <T id="UsersTable.assignedTo" />{' '}
            {getUserFullName({
              firstName: assignedEmployee.firstName,
              lastName: assignedEmployee.lastName,
            }) || assignedEmployee.emails[0].address}
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
