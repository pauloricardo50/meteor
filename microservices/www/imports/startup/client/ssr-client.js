import React from 'react';
import ReactDOM from 'react-dom';
import { onPageLoad } from 'meteor/server-render';

import * as startupConstants from '../shared/startupConstants';
import { store } from '../shared/setupStore';
import MaterialUiClient from './MaterialUiClient';
import ClientApp from './ClientApp';

onPageLoad(() => {
  ReactDOM.hydrate(
    <MaterialUiClient>
      <ClientApp store={store} />
    </MaterialUiClient>,
    document.getElementById(startupConstants.ROOT_ID),
  );
});
