import '../shared-startup';
import './init';

import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import 'url-search-params-polyfill';
import 'core/api/api';
import 'core/api/client/api';
import 'core/api/files/meteor-slingshot';

import '../accounts-config';
import './css';
import initHotjar from 'core/utils/hotjar';
import Analytics from 'core/api/analytics/Analytics';
import ProRouter from './ProRouter';

const start = (testElement) => {
  // Initial injected html done in server startup index.js
  const loader = document.getElementById('inject-loader-wrapper');
  if (loader) {
    loader.parentNode.removeChild(loader);
  }

  // Render react-router routes
  render(ProRouter(), testElement || document.getElementById('react-root'));

  // Hotjar
  initHotjar('pro');

  // Init client Analytics
  Analytics.initializeClient();
};

export default start;

Meteor.startup(start);
