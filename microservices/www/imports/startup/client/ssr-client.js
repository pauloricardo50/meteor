import React from 'react';
import ReactDOM from 'react-dom';
import { onPageLoad } from 'meteor/server-render';

import createStore from '../../redux';
import * as startupConstants from '../shared/startupConstants';
import MaterialUiClient from '../shared/MaterialUi/MaterialUiClient';
import ClientApp from './ClientApp';

const preloadedState = window[startupConstants.REDUX_STORE_KEY]; // eslint-disable-line
delete window[startupConstants.REDUX_STORE_KEY]; // eslint-disable-line

const { store, persistor } = createStore({ initialState: preloadedState });

onPageLoad(() => {
  ReactDOM.hydrate(
    <MaterialUiClient>
      <ClientApp store={store} persistor={persistor} />
    </MaterialUiClient>,
    document.getElementById(startupConstants.ROOT_ID),
  );
});
