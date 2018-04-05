import { Meteor } from 'meteor/meteor';
import React from 'react';

import SingleUserPage from '../SingleUserPage';

const AdminProfilePage = () => (
  <SingleUserPage match={{ params: { userId: Meteor.userId() } }} />
);

export default AdminProfilePage;
