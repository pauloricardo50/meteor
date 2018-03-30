import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';

import { getUserLocale, getFormats } from 'core/utils/localization';
import messagesFR from '../../../lang/fr.json';

import LibraryWrappers from 'core/components/BaseRouter/LibraryWrappers';
import Routes from '../shared/Routes';

const App = ({ store, Router }) => (
  <Provider store={store}>
    <LibraryWrappers
      i18n={{
        locale: getUserLocale(),
        messages: messagesFR,
        formats: getFormats(),
      }}
    >
      <Router>
        <Routes />
      </Router>
    </LibraryWrappers>
  </Provider>
);

App.propTypes = {
  store: PropTypes.object.isRequired,
  Router: PropTypes.any.isRequired,
};

export default App;
