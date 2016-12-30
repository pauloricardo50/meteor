import { Meteor } from 'meteor/meteor';
import { compose } from 'react-komposer';
import { FlowRouter } from 'meteor/kadira:flow-router';
import CreditRequests from '/imports/api/creditrequests/creditrequests.js';

import composeWithTracker from '../composeWithTracker';


import Loading from '/imports/ui/components/general/Loading.jsx';


// Use the underscore as a temporary substitute to export it again under its "real" name below
import AdminSingleUserPage1 from '/imports/ui/pages/admin/AdminSingleUserPage.jsx';


// Container function which reactively send the currently active credit Request as a prop
function composer1(props, onData) {
  const userId = FlowRouter.getParam('id');

  if (Meteor.subscribe('user', userId).ready()) {
    // User 0 is the current logged in user, hence [1]
    const user = Meteor.users.find({}).fetch()[1];

    onData(null, { user });
  }
}

function composer2(props, onData) {
  const userId = FlowRouter.getParam('id');
  if (Meteor.subscribe('allCreditRequests').ready()) {
    const creditRequests = CreditRequests.find({ userId }).fetch();

    onData(null, { creditRequests });
  }
}


// export all the pages with their real name for comfort
const AdminSingleUserPage2 = composeWithTracker(composer1, Loading)(AdminSingleUserPage1);
export const AdminSingleUserPage = composeWithTracker(composer2, Loading)(AdminSingleUserPage2);
