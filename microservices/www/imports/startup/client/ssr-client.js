import React from 'react';
import ReactDOM from 'react-dom';
import { onPageLoad } from 'meteor/server-render';

import createStore from '../../redux/store';
import * as startupConstants from '../shared/startupConstants';
import MaterialUiClient from '../shared/MaterialUi/MaterialUiClient';
import ClientApp from './ClientApp';

const preloadedState = window[startupConstants.REDUX_STORE_KEY]; // eslint-disable-line
delete window[startupConstants.REDUX_STORE_KEY]; // eslint-disable-line

const store = createStore({ initialState: preloadedState });

onPageLoad(() => {
  ReactDOM.hydrate(
    <MaterialUiClient>
      <ClientApp store={store} />
    </MaterialUiClient>,
    document.getElementById(startupConstants.ROOT_ID),
  );
});
