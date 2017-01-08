import { Meteor } from 'meteor/meteor';
import { compose } from 'react-komposer';
import LoanRequests from '/imports/api/loanrequests/loanrequests.js';

import composeWithTracker from '../composeWithTracker';


import Loading from '/imports/ui/components/general/Loading.jsx';


// Use the underscore as a temporary substitute to export it again under its "real" name below
import _PartnerHomePage from '/imports/ui/pages/partner/PartnerHomePage.jsx';


// Container function which reactively send the currently active loan Request as a prop
function composer(props, onData) {
  if (Meteor.subscribe('partnerRequests').ready()) {
    const loanRequest = LoanRequests.find({}).fetch();

    onData(null, { loanRequest });
  }
}


// export all the pages with their realname for comfort
export const PartnerHomePage = composeWithTracker(composer, Loading)(_PartnerHomePage);
