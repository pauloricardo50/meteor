import React from 'react';

import PasswordChange from 'core/components/AccountPage/PasswordChange';
import SingleUserPage from '../SingleUserPage';

const AdminAccountPage = props => {
  const { currentUser } = props;

  return (
    <>
      <SingleUserPage
        {...props}
        userId={currentUser._id}
        className="admin-account-page"
      >
        <div className="mb-16" />
        <PasswordChange />
      </SingleUserPage>
    </>
  );
};

export default AdminAccountPage;
