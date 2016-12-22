import { compose } from 'react-komposer';
import { Meteor } from 'meteor/meteor';

import composeWithTracker from '../composeWithTracker';

import PublicNav from '/imports/ui/components/general/PublicNav.jsx';
import LoadingNone from '/imports/ui/components/general/LoadingNone.jsx';


function composer(props, onData) {
  if (Meteor.subscribe('currentUser').ready()) {
    const currentUser = Meteor.users.find().fetch()[0];
    onData(null, { currentUser });
  }
}

// No loading component
export default composeWithTracker(composer)(PublicNav);
