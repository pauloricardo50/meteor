import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import '/imports/api/api';
import '../accounts-config';
import '../meteor-slingshot';

import { localizationStartup } from '../localization';
import RenderRoutes from './Router.jsx';

/**
 * start - sets the app up
 *
 * @param {dom element} testElement should be used during tests, to render the app in it
 *
 * @return {type} undefined
 */
export const start = (testElement) => {
  const loader = document.getElementById('inject-loader-wrapper');
  if (loader) {
    loader.parentNode.removeChild(loader);
  }

  localizationStartup();

  // Very important for all advanced tap/react/buttons/material-ui to work.
  // Might not be required in future react versions
  // Adds the onTouchTap (no delay) prop to all elements which take onClick (delay)
  // Call this before rendering react

  // When testing, this is called a second time, which throws an error, so
  // do not run this during tests
  if (!Meteor.isTest) {
    injectTapEventPlugin();
  }

  // Render react-router routes
  render(RenderRoutes(), testElement || document.getElementById('react-root'));
};

Meteor.startup(() => start());
