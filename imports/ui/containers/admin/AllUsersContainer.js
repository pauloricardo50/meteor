import { Meteor } from 'meteor/meteor';
import { compose } from 'react-komposer';
import { FlowRouter } from 'meteor/kadira:flow-router';
import LoanRequests from '/imports/api/loanrequests/loanrequests.js';

import composeWithTracker from '../composeWithTracker';


import Loading from '/imports/ui/components/general/Loading.jsx';


// Use the underscore as a temporary substitute to export it again under its "real" name below
import _AdminUsersPage from '/imports/ui/pages/admin/AdminUsersPage.jsx';


// Container function which reactively send the currently active loan Request as a prop
function composer(props, onData) {
  if (Meteor.subscribe('allUsers').ready()) {
    const users = Meteor.users.find({}).fetch();


    onData(null, { users });
  }
}


// export all the pages with their real name for comfort
export const AdminUsersPage = composeWithTracker(composer, Loading)(_AdminUsersPage);
