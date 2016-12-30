import { Meteor } from 'meteor/meteor';
import { compose } from 'react-komposer';
import { FlowRouter } from 'meteor/kadira:flow-router';
import CreditRequests from '/imports/api/creditrequests/creditrequests.js';

import composeWithTracker from '../composeWithTracker';


import Loading from '/imports/ui/components/general/Loading.jsx';


// Use the underscore as a temporary substitute to export it again under its "real" name below
import AdminHomePage1 from '/imports/ui/pages/admin/AdminHomePage.jsx';


// Container function which reactively send the currently active credit Request as a prop
function composer1(props, onData) {
  if (Meteor.subscribe('allCreditRequests').ready()) {
    const creditRequests = CreditRequests.find({}).fetch();

    onData(null, { creditRequests });
  }
}

function composer2(props, onData) {
  if (Meteor.subscribe('allUsers').ready()) {
    const users = Meteor.users.find({}).fetch();


    onData(null, { users });
  }
}


// export all the pages with their real name for comfort
const AdminHomePage2 = composeWithTracker(composer1, Loading)(AdminHomePage1);
export const AdminHomePage = composeWithTracker(composer2, Loading)(AdminHomePage2);
