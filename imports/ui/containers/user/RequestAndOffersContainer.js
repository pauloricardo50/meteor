import { Meteor } from 'meteor/meteor';
import { compose } from 'react-komposer';
import { FlowRouter } from 'meteor/kadira:flow-router';
import LoanRequests from '/imports/api/loanrequests/loanrequests';
import Offers from '/imports/api/offers/offers';

import composeWithTracker from '../composeWithTracker';


import Loading from '/imports/ui/components/general/Loading.jsx';


// Use the underscore as a temporary substitute to export it again under its "real" name below
import _StrategyPage from '/imports/ui/pages/user/StrategyPage.jsx';
import _StrategySinglePage from '/imports/ui/pages/user/StrategySinglePage.jsx';
import _Step2Page from '/imports/ui/pages/user/Step2Page.jsx';


// Container function which reactively send the currently active loan Request as a prop
function composer1(props, onData) {
  if (Meteor.subscribe('activeLoanRequest').ready()) {
    const loanRequest = LoanRequests.find({}).fetch()[0];
    onData(null, { loanRequest });
  } else {
    onData(null, null);
  }
}

function composer2(props, onData) {
  if (Meteor.subscribe('activeOffers').ready()) {
    const offers = Offers.find({}).fetch();
    onData(null, { offers });
  } else {
    onData(null, null);
  }
}

function composer2(props, onData) {
  if (Meteor.subscribe('activeOffers').ready()) {
    const offers = Offers.find({}).fetch();
    onData(null, { offers });
  } else {
    onData(null, null);
  }
}


// export all the pages with their realname for comfort
const StrategyPage1 = composeWithTracker(composer1, Loading)(_StrategyPage);
const StrategySinglePage1 = composeWithTracker(composer1, Loading)(_StrategySinglePage);
const Step2Page1 = composeWithTracker(composer1, Loading)(_Step2Page);

export const StrategyPage = composeWithTracker(composer2, Loading)(StrategyPage1);
export const StrategySinglePage = composeWithTracker(composer2, Loading)(StrategySinglePage1);
export const Step2Page = composeWithTracker(composer2, Loading)(Step2Page1);
