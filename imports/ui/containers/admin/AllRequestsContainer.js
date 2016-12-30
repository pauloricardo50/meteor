import { Meteor } from 'meteor/meteor';
import { compose } from 'react-komposer';
import { FlowRouter } from 'meteor/kadira:flow-router';
import CreditRequests from '/imports/api/creditrequests/creditrequests.js';

import composeWithTracker from '../composeWithTracker';


import Loading from '/imports/ui/components/general/Loading.jsx';


// Use the underscore as a temporary substitute to export it again under its "real" name below
import _AdminRequestsPage from '/imports/ui/pages/admin/AdminRequestsPage.jsx';


// Container function which reactively send the currently active credit Request as a prop
function composer(props, onData) {
  if (Meteor.subscribe('allCreditRequests').ready()) {
    const creditRequests = CreditRequests.find({}).fetch();

    onData(null, { creditRequests });
  }
}


// export all the pages with their real name for comfort
export const AdminRequestsPage = composeWithTracker(composer, Loading)(_AdminRequestsPage);
