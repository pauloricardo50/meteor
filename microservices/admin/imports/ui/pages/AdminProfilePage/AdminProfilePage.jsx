import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';

import SingleUserPage from '../SingleUserPage';

const AdminProfilePage = props => (
  <SingleUserPage match={{ params: { userId: Meteor.userId() } }} />
);

AdminProfilePage.propTypes = {};

export default AdminProfilePage;
