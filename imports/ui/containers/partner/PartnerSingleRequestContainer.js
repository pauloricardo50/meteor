import { Meteor } from 'meteor/meteor';
import { compose } from 'react-komposer';
import { FlowRouter } from 'meteor/kadira:flow-router';
import LoanRequests from '/imports/api/loanrequests/loanrequests.js';

import composeWithTracker from '../composeWithTracker';


import Loading from '/imports/ui/components/general/Loading.jsx';


// Use the underscore as a temporary substitute to export it again under its "real" name below
import _PartnerRequestPage from '/imports/ui/pages/partner/PartnerRequestPage.jsx';


function composer(props, onData) {
  const id = FlowRouter.getParam('requestId');

  if (Meteor.subscribe('partnerSingleLoanRequest', id).ready()) {
    const loanRequest = LoanRequests.find({}).fetch()[0];

    // if (!loanRequest) {
    //   return;
    // }

    onData(null, { loanRequest });
  }
}

// export all the pages with their real name for comfort
export const PartnerRequestPage = composeWithTracker(composer, Loading)(_PartnerRequestPage);
