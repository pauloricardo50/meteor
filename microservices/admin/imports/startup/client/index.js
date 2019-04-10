import '../shared-startup';
import './init';

import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import 'core/api/api';
import 'core/api/client/api';

import '../accounts-config';
import './css';
import AdminRouter from './AdminRouter';
import 'react-dates/initialize'; // Fix issue #750

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
  render(AdminRouter(), testElement || document.getElementById('react-root'));
};

export default start;

Meteor.startup(start);
