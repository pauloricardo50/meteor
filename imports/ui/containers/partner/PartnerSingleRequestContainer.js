import { Meteor } from 'meteor/meteor';
import { compose } from 'react-komposer';
import { FlowRouter } from 'meteor/kadira:flow-router';
import CreditRequests from '/imports/api/creditrequests/creditrequests.js';

import composeWithTracker from '../composeWithTracker';


import Loading from '/imports/ui/components/general/Loading.jsx';


// Use the underscore as a temporary substitute to export it again under its "real" name below
import _PartnerRequestPage from '/imports/ui/pages/partner/PartnerRequestPage.jsx';


// Container function which reactively send the currently active credit Request as a prop
function composer(props, onData) {
  const id = FlowRouter.getParam('requestId');

  if (Meteor.subscribe('partnerSingleCreditRequest', id).ready()) {
    const creditRequest = CreditRequests.find({}).fetch()[0];


    onData(null, { creditRequest });
  }
}

// export all the pages with their real name for comfort
export const PartnerRequestPage = composeWithTracker(composer, Loading)(_PartnerRequestPage);
