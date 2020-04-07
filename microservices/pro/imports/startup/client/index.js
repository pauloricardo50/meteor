import 'url-search-params-polyfill';
import 'core/api/api';
import 'core/api/client/api';
import 'core/api/files/meteor-slingshot';
import 'core/startup/accounts-config';

import '../shared-startup';
import './init';
import './css';

import { Meteor } from 'meteor/meteor';

import { render } from 'react-dom';

import initGoogleTagManager from 'core/utils/googleTagManager';
import initHotjar from 'core/utils/hotjar';

import ProRouter from './ProRouter';

const start = testElement => {
  initGoogleTagManager();
  initHotjar('pro');

  // Initial injected html done in server startup index.js
  const loader = document.getElementById('inject-loader-wrapper');
  if (loader) {
    loader.parentNode.removeChild(loader);
  }

  // Render react-router routes
  render(ProRouter(), testElement || document.getElementById('react-root'));
};

export default start;

Meteor.startup(start);
