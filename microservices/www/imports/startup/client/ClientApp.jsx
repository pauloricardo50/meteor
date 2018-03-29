import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter } from 'react-router-dom';

import App from '../shared/App';

const ClientApp = ({ store }) => <App store={store} Router={BrowserRouter} />;

ClientApp.propTypes = {
  store: PropTypes.object.isRequired,
};

export default ClientApp;
