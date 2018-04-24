import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import App from '../shared/App';

const ClientApp = props => <App {...props} Router={BrowserRouter} />;

export default ClientApp;
