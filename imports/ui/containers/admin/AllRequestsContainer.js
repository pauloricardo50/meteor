import { Meteor } from 'meteor/meteor';
import { compose } from 'react-komposer';
import { FlowRouter } from 'meteor/kadira:flow-router';
import LoanRequests from '/imports/api/loanrequests/loanrequests';

import composeWithTracker from '../composeWithTracker';


import Loading from '/imports/ui/components/general/Loading.jsx';


// Use the underscore as a temporary substitute to export it again under its "real" name below
import _AdminRequestsPage from '/imports/ui/pages/admin/AdminRequestsPage.jsx';


// Container function which reactively send the currently active loan Request as a prop
function composer(props, onData) {
  if (Meteor.subscribe('allLoanRequests').ready()) {
    const loanRequests = LoanRequests.find({}).fetch();

    onData(null, { loanRequests });
  }
}


// export all the pages with their real name for comfort
export const AdminRequestsPage = composeWithTracker(composer, Loading)(_AdminRequestsPage);
