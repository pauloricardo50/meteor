import React from 'react';
import ReactDOM from 'react-dom';
import { onPageLoad } from 'meteor/server-render';

import * as startupConstants from '../shared/startupConstants';
import MaterialUiClient from '../shared/MaterialUi/MaterialUiClient';
import ClientApp from './ClientApp';
import { store } from '../shared/setupStore';

onPageLoad(() => {
  ReactDOM.hydrate(
    <MaterialUiClient>
      <ClientApp store={store} />
    </MaterialUiClient>,
    document.getElementById(startupConstants.ROOT_ID),
  );
});
