import { compose } from 'react-komposer';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import LoanRequests from '/imports/api/loanrequests/loanrequests.js';

import composeWithTracker from '../composeWithTracker';


import _BottomNav from '/imports/ui/components/general/BottomNav.jsx';
import _RequestProgressBar from '/imports/ui/components/general/RequestProgressBar.jsx';
import _SideNav from '/imports/ui/components/general/SideNav.jsx';
import _AdminNav from '/imports/ui/components/admin/AdminNav.jsx';

import Loading from '/imports/ui/components/general/Loading.jsx';
import LoadingNone from '/imports/ui/components/general/LoadingNone.jsx';

function composer1(props, onData) {
  FlowRouter.watchPathChange();
  const currentURL = FlowRouter.current().path;
  onData(null, { currentURL });
}

function composer2(props, onData) {
  if (Meteor.subscribe('activeLoanRequest').ready()) {
    const loanRequest = LoanRequests.find({}).fetch()[0];

    // if (!loanRequest) {
    //   return;
    // }

    onData(null, { loanRequest });
  }
}

const container1 = composeWithTracker(composer1, LoadingNone)(_RequestProgressBar);
const container2 = composeWithTracker(composer1, LoadingNone)(_SideNav);
export const AdminNav = composeWithTracker(composer1)(_AdminNav);

export const RequestProgressBar = composeWithTracker(composer2, LoadingNone)(container1);
export const SideNav = composeWithTracker(composer2, LoadingNone)(container2);
// export const AdminNav = composeWithTracker(composer2, LoadingNone)(container3);

export const BottomNav = composeWithTracker(composer1, LoadingNone)(_BottomNav);
