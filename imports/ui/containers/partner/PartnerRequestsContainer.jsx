import { Meteor } from 'meteor/meteor';
import { composeWithTracker } from 'react-komposer';
import { FlowRouter } from 'meteor/kadira:flow-router';
import CreditRequests from '/imports/api/creditrequests/creditrequests.js';

import Loading from '/imports/ui/components/general/Loading.jsx';


// Use the underscore as a temporary substitute to export it again under its "real" name below
import _PartnerHomePage from '/imports/ui/pages/partner/PartnerHomePage.jsx';


// Container function which reactively send the currently active credit Request as a prop
function composer(props, onData) {
  if (Meteor.subscribe('activeCreditRequest').ready()) {
    const creditRequest = CreditRequests.find({}).fetch()[0];
    const path = FlowRouter.current().path;

    // If there is no creditRequest, go to the main page, except for new, settings and contact page
    if (!creditRequest && ((path.substring(0, 4) !== '/new') && (path !== '/settings') && (path !== '/contact'))) {
      FlowRouter.go('/main');
    }

    onData(null, { creditRequest });
  }
}


// export all the pages with their realname for comfort
export const PartnerHomePage = composeWithTracker(composer, Loading)(_PartnerHomePage);
