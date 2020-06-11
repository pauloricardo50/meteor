import { onPageLoad } from 'meteor/server-render';

import React from 'react';
import ReactDOM from 'react-dom';

import { store } from '../shared/setupStore';
import * as startupConstants from '../shared/startupConstants';
import ClientApp from './ClientApp';
import MaterialUiClient from './MaterialUiClient';

onPageLoad(() => {
  ReactDOM.hydrate(
    <MaterialUiClient>
      <ClientApp store={store} />
    </MaterialUiClient>,
    document.getElementById(startupConstants.ROOT_ID),
  );
});
