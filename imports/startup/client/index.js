import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import '../accounts-config';
import '../meteor-slingshot';

import { localizationStartup } from './localization';
import RenderRoutes from './routes.jsx';
import injectTapEventPlugin from 'react-tap-event-plugin';

Meteor.startup(() => {
  // Remove injected loader
  const loader = document.getElementById('inject-loader-wrapper');
  if (loader) {
    loader.parentNode.removeChild(loader);
  }

  localizationStartup();

  // Very important for all advanced tap/react/buttons/material-ui to work.
  // Might not be required in future react versions
  // Adds the onTouchTap (no delay) prop to all elements which take onClick (delay)
  // Call this before rendering react
  injectTapEventPlugin();

  // Render react-router routes
  render(RenderRoutes(), document.getElementById('react-root'));
});
