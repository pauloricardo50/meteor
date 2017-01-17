import { Meteor } from 'meteor/meteor';
import { compose } from 'react-komposer';
import LoanRequests from '/imports/api/loanrequests/loanrequests.js';
import Offers from '/imports/api/offers/offers.js';

import composeWithTracker from '../composeWithTracker';


import Loading from '/imports/ui/components/general/Loading.jsx';


// Use the underscore as a temporary substitute to export it again under its "real" name below
import _PartnerHomePage from '/imports/ui/pages/partner/PartnerHomePage.jsx';


function composer1(props, onData) {
  if (Meteor.subscribe('partnerRequestsAuction').ready()) {
    const loanRequests = LoanRequests.find({}).fetch();

    onData(null, { loanRequests });
  }
}

function composer2(props, onData) {
  if (Meteor.subscribe('partnerRequestsCompleted').ready()) {
    const loanRequests = LoanRequests.find({}).fetch();

    onData(null, { loanRequests });
  }
}

function composer3(props, onData) {
  if (Meteor.subscribe('partnerOffers').ready()) {
    // TODO make sure this works in any time zone
    const currentOffers = Offers.find({
      auctionEndTime: { $gte: new Date() },
    }).fetch();

    // auction end time is less than current time
    const oldOffers = Offers.find({
      auctionEndTime: { $lt: new Date() },
    }).fetch();

    onData(null, { currentOffers, oldOffers });
  }
}


// export all the pages with their realname for comfort
const PartnerHomePage1 = composeWithTracker(composer1, Loading)(_PartnerHomePage);
const PartnerHomePage2 = composeWithTracker(composer2, Loading)(PartnerHomePage1);
export const PartnerHomePage = composeWithTracker(composer3, Loading)(PartnerHomePage2);
