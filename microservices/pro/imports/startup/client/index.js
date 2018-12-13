import '../shared-startup';

import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import { localizationStartup } from 'core/utils/localization';
import 'url-search-params-polyfill';
import 'core/api/api';
import 'core/api/client/api';
import 'core/api/files/meteor-slingshot';

import '../accounts-config';
import './css';
import ProRouter from './ProRouter';

const start = (testElement) => {
  // Initial injected html done in server startup index.js
  const loader = document.getElementById('inject-loader-wrapper');
  if (loader) {
    loader.parentNode.removeChild(loader);
  }

  localizationStartup();

  // Render react-router routes
  render(ProRouter(), testElement || document.getElementById('react-root'));
};

export default start;

Meteor.startup(start);
