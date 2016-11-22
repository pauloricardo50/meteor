import { composeWithTracker } from 'react-komposer';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import CreditRequests from '/imports/api/creditrequests/creditrequests.js';


import _BottomNav from '/imports/ui/components/general/BottomNav.jsx';
import _RequestProgressBar from '/imports/ui/components/general/RequestProgressBar.jsx';
import _SideNav from '/imports/ui/components/general/SideNav.jsx';

import Loading from '/imports/ui/components/general/Loading.jsx';

function composer1(props, onData) {
  FlowRouter.watchPathChange();
  const currentURL = FlowRouter.current().path;
  onData(null, { currentURL });
}

function composer2(props, onData) {
  if (Meteor.subscribe('activeCreditRequest').ready()) {
    const creditRequest = CreditRequests.find({}).fetch()[0];
    onData(null, { creditRequest });
  }
}

const container1 = composeWithTracker(composer1, Loading)(_RequestProgressBar);
const container2 = composeWithTracker(composer1, Loading)(_SideNav);
export const RequestProgressBar = composeWithTracker(composer2, Loading)(container1);
export const SideNav = composeWithTracker(composer2, Loading)(container2);

export const BottomNav = composeWithTracker(composer1, Loading)(_BottomNav);
