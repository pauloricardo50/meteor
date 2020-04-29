import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import HistoryWatcher from 'core/components/BaseRouter/HistoryWatcher';
import MicroserviceHead from 'core/components/MicroserviceHead';
import withErrorCatcher from 'core/containers/withErrorCatcher';
import history from 'core/utils/history';

import App from '../shared/App';
import { WWW_ROUTES } from '../shared/Routes';

const ClientApp = props => (
  <>
    <MicroserviceHead addOgTags={false} />
    <HistoryWatcher history={history} routes={WWW_ROUTES}>
      <App {...props} Router={BrowserRouter} history={history} />
    </HistoryWatcher>
  </>
);

export default withErrorCatcher(ClientApp);
