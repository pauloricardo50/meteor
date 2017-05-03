import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import RenderRoutes from './routes.jsx';
import '../accounts-config';
import '../meteor-slingshot';

Meteor.startup(() => {
  render(RenderRoutes(), document.getElementById('react-root'));
});

// Very important for all advanced tap/react/buttons/material-ui to work.
// Might not be required in future react versions
// Adds the onTouchTap (no delay) prop to all elements which take onClick (delay)
injectTapEventPlugin();
