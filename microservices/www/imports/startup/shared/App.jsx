import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { getUserLocale, getFormats } from 'core/utils/localization';
import Loading from 'core/components/Loading';
import { TooltipProvider } from 'core/components/tooltips/TooltipContext';
import messagesFR from '../../../lang/fr.json';

import LibraryWrappers from 'core/components/BaseRouter/LibraryWrappers';
import Routes from '../shared/Routes';

const App = ({ store, persistor, Router }) => (
  <Provider store={store}>
    <PersistGate persistor={persistor} loading={<Loading />}>
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
    </PersistGate>
  </Provider>
);

App.propTypes = {
  persistor: PropTypes.object,
  store: PropTypes.object.isRequired,
  Router: PropTypes.any.isRequired,
};

App.defaultProps = {
  persistor: undefined,
};

export default App;
