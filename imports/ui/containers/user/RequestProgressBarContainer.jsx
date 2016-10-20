import { Meteor } from 'meteor/meteor';
import { composeWithTracker } from 'react-komposer';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { CreditRequests } from '/imports/api/creditrequests/creditrequests.js';

import RequestProgressBar from '/imports/ui/components/general/RequestProgressBar.jsx';
import Loading from '/imports/ui/components/general/Loading.jsx';

function composer(props, onData) {
  const requestId = FlowRouter.getParam('id');

  if (Meteor.subscribe('creditRequest', requestId).ready()) {
    // [0]: return only the first element of the array, which only contains a single request anyways
    const step = CreditRequests.find().fetch()[0].step;
    onData(null, { step });
  }
}

export default composeWithTracker(composer, Loading)(RequestProgressBar);
