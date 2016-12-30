import { Meteor } from 'meteor/meteor';
import { compose } from 'react-komposer';
import { FlowRouter } from 'meteor/kadira:flow-router';
import CreditRequests from '/imports/api/creditrequests/creditrequests.js';

import composeWithTracker from '../composeWithTracker';


import Loading from '/imports/ui/components/general/Loading.jsx';


// Use the underscore as a temporary substitute to export it again under its "real" name below
import AdminSingleRequestPage1 from '/imports/ui/pages/admin/AdminSingleRequestPage.jsx';


// Container function which reactively send the currently active credit Request as a prop
function composer1(props, onData) {
  const requestId = FlowRouter.getParam('id');

  if (Meteor.subscribe('creditRequest', requestId).ready()) {
    const creditRequest = CreditRequests.find({}).fetch()[0];

    onData(null, { creditRequest });
  }
}

function composer2(props, onData) {
  const requestId = FlowRouter.getParam('id');
  if (Meteor.subscribe('creditRequest', requestId).ready()) {

    const userId = CreditRequests.find({}).fetch()[0].userId;
    if (Meteor.subscribe('user', userId).ready()) {
      const user = Meteor.users.find({}).fetch()[0];

      onData(null, { user });
    }
  }
}


// export all the pages with their real name for comfort
const AdminSingleRequestPage2 = composeWithTracker(composer1, Loading)(AdminSingleRequestPage1);
export const AdminSingleRequestPage = composeWithTracker(composer2, Loading)(AdminSingleRequestPage2);
