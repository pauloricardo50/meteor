import PropTypes from 'prop-types';
import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { IntlProvider, intlShape } from 'react-intl';

import messages from '/build/lang/fr.json'; // en.json

import myTheme from '/imports/js/config/mui_custom';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// Mounts a component for testing, and wraps it around everything it needs
const customMount = (Component, props, withRouter) => {
  const intlProvider = new IntlProvider({ locale: 'en', messages }, {});
  const { intl } = intlProvider.getChildContext();

  return mount(
    withRouter
      ? <MemoryRouter>
        <Component {...props} />
      </MemoryRouter>
      : <Component {...props} />,
    {
      context: {
        muiTheme: getMuiTheme(myTheme),
        intl,
      },
      childContextTypes: {
        muiTheme: PropTypes.object,
        intl: intlShape,
      },
    },
  );
};

const getMountedComponent = (Component, props, withRouter) => {
  if (!getMountedComponent.mountedComponent) {
    getMountedComponent.mountedComponent = customMount(Component, props, withRouter);
  }
  return getMountedComponent.mountedComponent;
};

getMountedComponent.reset = () => {
  // delete getMountedComponent.mountedComponent;
  getMountedComponent.mountedComponent = undefined;
};

export default getMountedComponent;
