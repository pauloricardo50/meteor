import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

import Routes from '../shared/Routes';

const ClientApp = ({ store }) => (
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Routes />
      </Switch>
    </BrowserRouter>
  </Provider>
);

ClientApp.propTypes = {
  store: PropTypes.object.isRequired,
};

export default ClientApp;
