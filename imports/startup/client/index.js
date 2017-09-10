import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import injectTapEventPlugin from 'react-tap-event-plugin';

import '/imports/api/api.js';
import '../accounts-config';
import '../meteor-slingshot';

import { localizationStartup } from '../localization';
import RenderRoutes from './Router';

/**
 * start - sets the app up
 *
 * @param {dom element} testElement should be used during tests, to render the app in it
 *
 * @return {type} undefined
 */
const start = (testElement) => {
  // Initial injected html done in server startup index.js
  const loader = document.getElementById('inject-loader-wrapper');
  const loader2 = document.getElementById('loading-text');
  if (loader) {
    loader.parentNode.removeChild(loader);
  }
  if (loader2) {
    loader2.parentNode.removeChild(loader2);
  }

  localizationStartup();

  injectTapEventPlugin();

  // Render react-router routes
  render(RenderRoutes(), testElement || document.getElementById('react-root'));
};

export default start;

Meteor.startup(() => start());
