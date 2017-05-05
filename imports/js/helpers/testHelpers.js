import PropTypes from 'prop-types';
import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';

import myTheme from '/imports/js/config/mui_custom';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// Mounts a component for testing, and wraps it around everything it needs
const customMount = (Component, props) => {
  return mount(
    <IntlProvider locale="fr">
      <MemoryRouter>
        <Component {...props} />
      </MemoryRouter>
    </IntlProvider>,
    {
      context: { muiTheme: getMuiTheme(myTheme) },
      childContextTypes: { muiTheme: PropTypes.object },
    },
  );
};

const getMountedComponent = (Component, props, mountedComponent) => {
  let newMountedComponent = mountedComponent;
  if (!newMountedComponent) {
    newMountedComponent = customMount(Component, props);
  }
  return newMountedComponent;
};

export default getMountedComponent;
