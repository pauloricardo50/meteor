import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import withErrorCatcher from 'core/utils/withErrorCatcher';
import MicroserviceHead from 'core/components/MicroserviceHead';
import App from '../shared/App';

const ClientApp = props => (
  <>
    <MicroserviceHead />
    <App {...props} Router={BrowserRouter} />
  </>
);

export default withErrorCatcher(ClientApp);
