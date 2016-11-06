import { composeWithTracker } from 'react-komposer';
import { Meteor } from 'meteor/meteor';

import SettingsPage from '/imports/ui/pages/user/SettingsPage.jsx';
import Loading from '/imports/ui/components/general/Loading.jsx';

function composer(props, onData) {
  if (Meteor.subscribe('currentUser').ready()) {
    // Get the first element of this array which has only one element
    const currentUser = Meteor.users.find().fetch()[0];
    onData(null, { currentUser });
  }
}

export default composeWithTracker(composer, Loading)(SettingsPage);
