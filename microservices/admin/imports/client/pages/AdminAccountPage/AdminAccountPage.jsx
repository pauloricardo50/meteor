import React from 'react';

import PasswordChange from 'core/components/AccountPage/PasswordChange';
import SingleUserPage from '../SingleUserPage';

const AdminAccountPage = props => {
  const { currentUser } = props;

  return (
    <>
      <SingleUserPage
        {...props}
        match={{ params: { userId: currentUser._id } }}
        className="admin-account-page"
      >
        <br />
        <PasswordChange />
      </SingleUserPage>
    </>
  );
};

export default AdminAccountPage;
