import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';

import { getUserLocale, getFormats } from 'core/utils/localization';
import { TooltipProvider } from 'core/components/tooltips/TooltipContext';
import LibraryWrappers from 'core/components/BaseRouter/LibraryWrappers';
import { InjectMeteorUser } from 'core/containers/CurrentUserContext';
import messagesFR from '../../../lang/fr.json';
import Routes from './Routes';

const App = ({ store, Router }) => (
  <Provider store={store}>
    <InjectMeteorUser>
      <LibraryWrappers
        i18n={{
          locale: getUserLocale(),
          messages: messagesFR,
          formats: getFormats(),
        }}
        withMui={false}
      >
        <TooltipProvider>
          <Router>
            <Routes />
          </Router>
        </TooltipProvider>
      </LibraryWrappers>
    </InjectMeteorUser>
  </Provider>
);

App.propTypes = {
  Router: PropTypes.any.isRequired,
  store: PropTypes.object.isRequired,
};

export default App;
