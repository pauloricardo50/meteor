import { Meteor } from 'meteor/meteor';
import { composeWithTracker } from 'react-komposer';
import { DocHead } from 'meteor/kadira:dochead';
import { CreditRequests } from '/imports/api/creditrequests/creditrequests.js';

import MainPage from '/imports/ui/pages/user/MainPage.jsx';
import Loading from '/imports/ui/components/general/Loading.jsx';

function composer(props, onData) {
  Meteor.userId();
  if (Meteor.subscribe('creditRequests').ready()) {
    const creditRequests = CreditRequests.find({}).fetch();
    onData(null, { creditRequests });
  }

  DocHead.setTitle('Mes Financements - e-Potek');
}

export default composeWithTracker(composer, Loading)(MainPage);
