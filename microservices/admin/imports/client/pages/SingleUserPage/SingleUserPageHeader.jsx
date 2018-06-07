import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';

import T from 'core/components/Translation';
import Roles from 'core/components/Roles';
import ImpersonateLink from 'core/components/Impersonate/ImpersonateLink';
import RolePicker from '../../components/RolePicker';
import EditUserFormDialog from './EditUserFormDialog';

const SingleUserPageHeader = ({ user }) => (
  <div className="single-user-page-header">
    <div className="top">
      <h1>
        {user.emails[0].address}
        <small className="secondary">
          &nbsp;-&nbsp;<Roles roles={user.roles} />
        </small>
        <RolePicker userId={user._id} />
      </h1>
      <EditUserFormDialog user={user} />
      <ImpersonateLink user={user} className="impersonate-link" />
    </div>

    <div className="bottom">
      <p className="secondary created-at">
        <T id="UsersTable.createdAt" />{' '}
        {moment(user.createdAt).format('D MMM YY à HH:mm:ss')}
      </p>

      {user.assignedEmployee && (
        <p>
          &nbsp; - &nbsp;
          <T id="UsersTable.assignedTo" />{' '}
          {user.assignedEmployee.emails[0].address}
        </p>
      )}
    </div>
  </div>
);

SingleUserPageHeader.propTypes = {
  user: PropTypes.object.isRequired,
};

export default SingleUserPageHeader;
