import { Meteor } from 'meteor/meteor';
import { compose } from 'react-komposer';
import { FlowRouter } from 'meteor/kadira:flow-router';
import LoanRequests from '/imports/api/loanrequests/loanrequests';
import Offers from '/imports/api/offers/offers';


import composeWithTracker from '../composeWithTracker';


import Loading from '/imports/ui/components/general/Loading.jsx';


// Use the underscore as a temporary substitute to export it again under its "real" name below
import AdminSingleRequestPage1 from '/imports/ui/pages/admin/AdminSingleRequestPage.jsx';
import AdminOfferPage1 from '/imports/ui/pages/admin/AdminOfferPage.jsx';


// Get the request specified in the URL
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

// Get the user related to this request
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


// Get all offers for this request
function composer3(props, onData) {
  const requestId = FlowRouter.getParam('id');
  if (Meteor.subscribe('requestOffers', requestId).ready()) {
    const offers = Offers.find({}).fetch();

    // if (!offers) {
    //   return;
    // }

    onData(null, { offers });
  }
}


// export all the pages with their real name for comfort
const AdminSingleRequestPage2 = composeWithTracker(composer1, Loading)(AdminSingleRequestPage1);
const AdminSingleRequestPage3 = composeWithTracker(composer2, Loading)(AdminSingleRequestPage2);
export const AdminSingleRequestPage = composeWithTracker(composer3, Loading)(AdminSingleRequestPage3);


const AdminOfferPage2 = composeWithTracker(composer1, Loading)(AdminOfferPage1);
const AdminOfferPage3 = composeWithTracker(composer2, Loading)(AdminOfferPage2);
export const AdminOfferPage = composeWithTracker(composer3, Loading)(AdminOfferPage3);
