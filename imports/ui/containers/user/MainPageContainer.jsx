import { Meteor } from 'meteor/meteor';
import { composeWithTracker } from 'react-komposer';
import { DocHead } from 'meteor/kadira:dochead';
import { CreditRequests } from '/imports/api/creditrequests/creditrequests.js';

import MainPage from '/imports/ui/pages/user/MainPage.jsx';
import Loading from '/imports/ui/components/general/Loading.jsx';

function composer(props, onData) {
  if (Meteor.subscribe('activeCreditRequest').ready()) {
    const creditRequest = CreditRequests.find({}).fetch()[0];
    onData(null, { creditRequest });
  }
  DocHead.setTitle('Mes Financements - e-Potek');
}

export default composeWithTracker(composer, Loading)(MainPage);
