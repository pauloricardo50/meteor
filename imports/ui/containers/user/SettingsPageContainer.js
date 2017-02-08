import { compose } from 'react-komposer';
import { Meteor } from 'meteor/meteor';
import LoanRequests from '/imports/api/loanrequests/loanrequests';


import composeWithTracker from '../composeWithTracker';

import SettingsPage from '/imports/ui/pages/user/SettingsPage.jsx';
import Loading from '/imports/ui/components/general/Loading.jsx';


function composer(props, onData) {
  if (Meteor.subscribe('currentUser').ready()) {
    if (Meteor.subscribe('loanRequests').ready()) {
      // Get this user's loan requests
      const loanRequests = LoanRequests.find().fetch();

      // Get the first element of this array which has only one element
      const currentUser = Meteor.users.find().fetch()[0];

      // Send data to the page
      onData(null, { currentUser, loanRequests });
    }
  }
}

export default composeWithTracker(composer, Loading)(SettingsPage);
