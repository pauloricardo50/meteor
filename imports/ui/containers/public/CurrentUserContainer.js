import { compose } from 'react-komposer';
import { Meteor } from 'meteor/meteor';

import composeWithTracker from '../composeWithTracker';

import _PublicNav from '/imports/ui/components/general/PublicNav.jsx';
import LoadingNone from '/imports/ui/components/general/LoadingNone.jsx';
import Loading from '/imports/ui/components/general/Loading.jsx';

import _AdminLayout from '/imports/ui/layouts/AdminLayout.jsx';
import _PartnerLayout from '/imports/ui/layouts/PartnerLayout.jsx';
import _UserLayout from '/imports/ui/layouts/UserLayout.jsx';


function composer(props, onData) {
  if (Meteor.subscribe('currentUser').ready()) {
    const currentUser = Meteor.users.find().fetch()[0];

    onData(null, { currentUser });
  }
}

// No loading component
export const PublicNav = composeWithTracker(composer)(_PublicNav);

export const AdminLayout = composeWithTracker(composer, Loading)(_AdminLayout);
export const PartnerLayout = composeWithTracker(composer, Loading)(_PartnerLayout);
export const UserLayout = composeWithTracker(composer, Loading)(_UserLayout);
