import '../shared-startup';

import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

// Keep localization before api to translate simple schema
import { localizationStartup } from 'core/utils/localization';

import 'url-search-params-polyfill';
import 'core/api/api';
import 'core/api/client/api';

import '../accounts-config';
import './css';
import AppRouter from './AppRouter';

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
  if (loader) {
    loader.parentNode.removeChild(loader);
  }

  localizationStartup();

  // Render react-router routes
  render(AppRouter(), testElement || document.getElementById('react-root'));
};

export default start;

Meteor.startup(start);
