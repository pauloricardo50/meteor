import React from 'react';

import PasswordChange from 'core/components/AccountPage/PasswordChange';
import SingleUserPage from '../SingleUserPage';
import DefaultBoardIdModifier from './DefaultBoardIdModifier';

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
        <div className="flex-col center-align">
          <DefaultBoardIdModifier currentUser={currentUser} />
          <PasswordChange />
        </div>
      </SingleUserPage>
    </>
  );
};

export default AdminAccountPage;
