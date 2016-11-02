import { Meteor } from 'meteor/meteor';
import { composeWithTracker } from 'react-komposer';
import { CreditRequests } from '/imports/api/creditrequests/creditrequests.js';

import RequestProgressBar from '/imports/ui/components/general/RequestProgressBar.jsx';
import Loading from '/imports/ui/components/general/Loading.jsx';

function composer(props, onData) {
  if (Meteor.subscribe('activeCreditRequest').ready()) {
    // [0]: return only the first element of the array, which only contains a single request anyways
    const creditRequest = CreditRequests.find({}).fetch()[0];
    onData(null, { creditRequest });
  }
}


export default composeWithTracker(composer, Loading)(RequestProgressBar);
