import { Meteor } from 'meteor/meteor';
import React from 'react';

import SingleUserPage from '../SingleUserPage';

const AdminAccountPage = () => (
  <SingleUserPage
    match={{ params: { userId: Meteor.userId() } }}
    className="admin-account-page"
  />
);

export default AdminAccountPage;
