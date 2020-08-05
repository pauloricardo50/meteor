import { Meteor } from 'meteor/meteor';

import React from 'react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import messages from '../../lang/fr.json';
import { getFormats, getUserLocale } from '../localization';
import { mount } from './enzyme';

// Mounts a component for testing, and wraps it around everything it needs
const customMount = ({ Component, props = {}, withRouter }) => {
  const customMountData = {};

  const locale = getUserLocale();

  let testComponent = (
    <IntlProvider
      locale={locale}
      messages={messages}
      formats={getFormats()}
      defaultLocale="fr-CH"
      onError={console.warn}
    >
      <Component {...props} />
    </IntlProvider>
  );

  if (withRouter) {
    testComponent = (
      <MemoryRouter>
        {React.cloneElement(testComponent, {
          history: { location: { pathname: '' } },
        })}
      </MemoryRouter>
    );
  }

  return {
    mountedComponent: mount(testComponent),
    customMountData,
  };
};

/**
 * getMountedComponent - Returns a mounted component with all the required
 * wrappers for testing
 *
 * @param {object} Component  A React component
 * @param {object} props      optional props to be passed into the component
 * @param {boolean} withRouter Wraps the component with a mocked router if this
 * component uses any of the react-router-dom components, like Link or NavLink
 *
 * @return {object} A mounted component, ready for testing with Enzyme
 */
const getMountedComponent = ({ Component, props, withRouter }) => {
  if (!getMountedComponent.mountedComponent) {
    const { mountedComponent, customMountData } = customMount({
      Component,
      props,
      withRouter,
    });
    getMountedComponent.getData = () => customMountData;
    getMountedComponent.mountedComponent = mountedComponent;
  }
  return getMountedComponent.mountedComponent;
};

/**
 * Unknown - Resets the component, to be called in beforeEach hooks
 *
 * @return {type} undefined
 */
getMountedComponent.reset = () => {
  getMountedComponent.mountedComponent = undefined;
  if (Meteor.isServer) {
    global.document = undefined;
    global.window = undefined;
    const jsdom = require('jsdom');
    const { JSDOM } = jsdom;
    const { document } = new JSDOM(
      '<!doctype html><html><body></body></html>',
    ).window;
    global.document = document;
    global.window = document.defaultView;
    // Do this to avoid an annoying bug resulting of the mix of jsdom and kadira
    // https://github.com/kadirahq/node-eventloop-monitor/blob/master/lib/index.js:73
    // https://github.com/jsdom/jsdom/blob/master/lib/jsdom/living/hr-time/Performance-impl.js:13
    global.window.performance.now = () => {};
  }
};

export default getMountedComponent;
