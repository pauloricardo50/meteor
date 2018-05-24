import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { IntlProvider, intlShape } from 'react-intl';
import { mount } from './enzyme';
import { getUserLocale, getFormats } from '../localization';
import messagesFR from '../../lang/fr.json';

// Mounts a component for testing, and wraps it around everything it needs
const customMount = ({ Component, props = {}, withRouter, withStore }) => {
  const intlProvider = new IntlProvider(
    {
      locale: getUserLocale(),
      messages: messagesFR,
      formats: getFormats(),
      defaultLocale: 'fr',
    },
    {},
  );
  const { intl } = intlProvider.getChildContext();

  let testComponent = <Component {...props} />;

  if (withRouter) {
    testComponent = (
      <MemoryRouter>
        {React.cloneElement(testComponent, {
          history: { location: { pathname: '' } },
        })}
      </MemoryRouter>
    );
  }

  if (withStore) {
    const configureStore = require('redux-mock-store');
    const { Provider } = require('react-redux');
    const mockStore = configureStore();
    const initialState = { stepper: {} };
    const store = mockStore(initialState);
    testComponent = <Provider store={store}>{testComponent}</Provider>;
  }

  return mount(testComponent, {
    context: { intl },
    childContextTypes: { intl: intlShape },
  });
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
const getMountedComponent = ({ Component, props, withRouter, withStore }) => {
  if (!getMountedComponent.mountedComponent) {
    getMountedComponent.mountedComponent = customMount({
      Component,
      props,
      withRouter,
      withStore,
    });
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
};

export default getMountedComponent;
