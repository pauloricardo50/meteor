import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import withErrorCatcher from 'core/containers/withErrorCatcher';
import MicroserviceHead from 'core/components/MicroserviceHead';
import history from 'core/utils/history';
import HistoryWatcher from 'core/components/BaseRouter/HistoryWatcher';
import App from '../shared/App';
import { WWW_ROUTES } from '../shared/Routes';

const ClientApp = props => (
  <>
    <MicroserviceHead />
    <HistoryWatcher history={history} routes={WWW_ROUTES}>
      <App {...props} Router={BrowserRouter} history={history} />
    </HistoryWatcher>
  </>
);

export default withErrorCatcher(ClientApp);
