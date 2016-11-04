import { Meteor } from 'meteor/meteor';
import { composeWithTracker } from 'react-komposer';
import { DocHead } from 'meteor/kadira:dochead';
import { CreditRequests } from '/imports/api/creditrequests/creditrequests.js';

import ContactPage from '/imports/ui/pages/user/ContactPage.jsx';
import Loading from '/imports/ui/components/general/Loading.jsx';

function composer(props, onData) {
  if (Meteor.subscribe('activeCreditRequest').ready()) {
    // [0]: return only the first element of the array, which only contains a single request anyways
    const creditRequest = CreditRequests.find().fetch()[0];
    onData(null, { creditRequest });
  }

  DocHead.setTitle('Nous Contacter - e-Potek');
}

export default composeWithTracker(composer, Loading)(ContactPage);
