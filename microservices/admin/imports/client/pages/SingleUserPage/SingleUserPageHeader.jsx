import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';

import T from 'core/components/Translation';
import Icon from 'core/components/Icon';
import Roles from 'core/components/Roles';
import ImpersonateLink from 'core/components/Impersonate/ImpersonateLink';
import ConfirmMethod from 'core/components/ConfirmMethod';
import { sendEnrollmentEmail } from 'core/api';
import RolePicker from '../../components/RolePicker';
import UserAssignDropdown from '../../components/AssignAdminDropdown/UserAssignDropdown';
import EditUserDialogForm from './EditUserDialogForm';
import UserDeleter from './UserDeleter';

const SingleUserPageHeader = ({ user, currentUser }) => {
  const {
    _id,
    assignedEmployee,
    createdAt,
    roles,
    phoneNumbers,
    name,
    email,
  } = user;

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
        <EditUserDialogForm user={user} />
        <ConfirmMethod
          method={() => sendEnrollmentEmail.run({ userId: _id })}
          label="Envoyer email d'invitation"
          keyword="ENVOYER"
        />
        <UserDeleter user={user} currentUser={currentUser} />
        <ImpersonateLink user={user} className="impersonate-link" />
      </div>

      <div className="bottom">
        <div className="email">
          <Icon type="mail" /> <a href={`mailto:${email}`}>{email}</a>
        </div>
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
