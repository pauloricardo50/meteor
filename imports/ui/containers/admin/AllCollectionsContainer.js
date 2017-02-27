import { Meteor } from 'meteor/meteor';
import { compose } from 'react-komposer';
import { FlowRouter } from 'meteor/kadira:flow-router';
import LoanRequests from '/imports/api/loanrequests/loanrequests';
import Offers from '/imports/api/offers/offers';

import composeWithTracker from '../composeWithTracker';


import Loading from '/imports/ui/components/general/Loading.jsx';


// Use the underscore as a temporary substitute to export it again under its "real" name below
import AdminHomePage1 from '/imports/ui/pages/admin/AdminHomePage.jsx';


// Container function which reactively send the currently active loan Request as a prop
function composer1(props, onData) {
  if (Meteor.subscribe('allLoanRequests').ready()) {
    const loanRequests = LoanRequests.find({}).fetch();

    onData(null, { loanRequests });
  }
}

function composer2(props, onData) {
  if (Meteor.subscribe('allUsers').ready()) {
    const users = Meteor.users.find({}).fetch();

    onData(null, { users });
  }
}

function composer3(props, onData) {
  if (Meteor.subscribe('allOffers').ready()) {
    const offers = Offers.find({}).fetch();

    onData(null, { offers });
  }
}


// export all the pages with their real name for comfort
const AdminHomePage2 = composeWithTracker(composer1, Loading)(AdminHomePage1);
const AdminHomePage3 = composeWithTracker(composer2, Loading)(AdminHomePage2);
export const AdminHomePage = composeWithTracker(composer3, Loading)(AdminHomePage3);
