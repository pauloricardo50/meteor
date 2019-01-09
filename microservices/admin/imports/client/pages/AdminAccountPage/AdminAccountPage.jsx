import { Meteor } from 'meteor/meteor';

import React from 'react';

import PasswordChange from 'core/components/AccountPage/PasswordChange';
import SingleUserPage from '../SingleUserPage';

const AdminAccountPage = () => (
  <>
    <SingleUserPage
      match={{ params: { userId: Meteor.userId() } }}
      className="admin-account-page"
    >
      <br />
      <PasswordChange />
    </SingleUserPage>
  </>
);

export default AdminAccountPage;
