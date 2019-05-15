import '../shared-startup';
import './init';

import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { Accounts } from 'meteor/accounts-base';

import 'url-search-params-polyfill';
import 'core/api/api';
import 'core/api/client/api';

import '../accounts-config';
import './css';
import initHotjar from 'core/utils/hotjar';
import Analytics from 'core/api/analytics/Analytics';
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

  // Render react-router routes
  render(AppRouter(), testElement || document.getElementById('react-root'));

  // Hotjar
  initHotjar('app');

  // Init client Analytics
  // Analytics.initializeClient();
};

export default start;

Meteor.startup(start);

// Accounts.onLogin(() => window.analytic.identify({ userId: Meteor.userId() }));
