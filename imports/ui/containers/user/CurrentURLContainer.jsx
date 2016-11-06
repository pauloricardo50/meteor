import { composeWithTracker } from 'react-komposer';
import { FlowRouter } from 'meteor/kadira:flow-router';

import _BottomNav from '/imports/ui/components/general/BottomNav.jsx';
import Loading from '/imports/ui/components/general/Loading.jsx';

function composer(props, onData) {
  FlowRouter.watchPathChange();
  const currentURL = FlowRouter.current().path;
  onData(null, { currentURL });
}

export const BottomNav = composeWithTracker(composer, Loading)(_BottomNav);
