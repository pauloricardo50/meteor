import { Meteor } from 'meteor/meteor';
import { compose } from 'react-komposer';
import { FlowRouter } from 'meteor/kadira:flow-router';
import LoanRequests from '/imports/api/loanrequests/loanrequests';

import composeWithTracker from '../composeWithTracker';


import Loading from '/imports/ui/components/general/Loading.jsx';


// Use the underscore as a temporary substitute to export it again under its "real" name below
import AdminSingleRequestPage1 from '/imports/ui/pages/admin/AdminSingleRequestPage.jsx';


// Container function which reactively send the currently active loan Request as a prop
function composer1(props, onData) {
  const requestId = FlowRouter.getParam('id');

  if (Meteor.subscribe('loanRequest', requestId).ready()) {
    const loanRequest = LoanRequests.find({}).fetch()[0];

    if (!loanRequest) {
      return;
    }

    onData(null, { loanRequest });
  }
}

function composer2(props, onData) {
  const requestId = FlowRouter.getParam('id');
  if (Meteor.subscribe('loanRequest', requestId).ready()) {

    const userId = LoanRequests.find({}).fetch()[0].userId;
    if (Meteor.subscribe('user', userId).ready()) {
      const user = Meteor.users.find({}).fetch()[0];

      onData(null, { user });
    }
  }
}


// export all the pages with their real name for comfort
const AdminSingleRequestPage2 = composeWithTracker(composer1, Loading)(AdminSingleRequestPage1);
export const AdminSingleRequestPage = composeWithTracker(composer2, Loading)(AdminSingleRequestPage2);
