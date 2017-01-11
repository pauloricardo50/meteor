import { Meteor } from 'meteor/meteor';
import { compose } from 'react-komposer';
import LoanRequests from '/imports/api/loanrequests/loanrequests.js';

import composeWithTracker from '../composeWithTracker';


import Loading from '/imports/ui/components/general/Loading.jsx';


// Use the underscore as a temporary substitute to export it again under its "real" name below
import _PartnerHomePage from '/imports/ui/pages/partner/PartnerHomePage.jsx';


function composer1(props, onData) {
  if (Meteor.subscribe('partnerRequestsAuction').ready()) {
    const loanRequests = LoanRequests.find({}).fetch();

    // if (!loanRequests) {
    //   return;
    // }

    onData(null, { loanRequests });
  }
}

function composer2(props, onData) {
  if (Meteor.subscribe('partnerRequestsCompleted').ready()) {
    const loanRequests = LoanRequests.find({}).fetch();

    // if (!loanRequests) {
    //   return;
    // }

    onData(null, { loanRequests });
  }
}


// export all the pages with their realname for comfort
const PartnerHomePage1 = composeWithTracker(composer1, Loading)(_PartnerHomePage);

export const PartnerHomePage = composeWithTracker(composer2, Loading)(PartnerHomePage1);
