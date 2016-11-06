import { composeWithTracker } from 'react-komposer';
import { Meteor } from 'meteor/meteor';
import CreditRequests from '/imports/api/creditrequests/creditrequests.js';


import SettingsPage from '/imports/ui/pages/user/SettingsPage.jsx';
import Loading from '/imports/ui/components/general/Loading.jsx';


function composer(props, onData) {
  if (Meteor.subscribe('currentUser').ready()) {
    if (Meteor.subscribe('creditRequests').ready()) {
      // Get this user's credit requests
      const creditRequests = CreditRequests.find().fetch();

      // Get the first element of this array which has only one element
      const currentUser = Meteor.users.find().fetch()[0];

      // Send data to the page
      onData(null, { currentUser, creditRequests });
    }
  }
}

export default composeWithTracker(composer, Loading)(SettingsPage);
