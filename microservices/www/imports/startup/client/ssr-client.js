import React from 'react';
import ReactDOM from 'react-dom';
import { onPageLoad } from 'meteor/server-render';

import createStore from '../../redux/store';
import ClientApp from './ClientApp';
import * as startupConstants from '../shared/startupConstants';

const preloadedState = window[startupConstants.REDUX_STORE_KEY]; // eslint-disable-line
delete window[startupConstants.REDUX_STORE_KEY]; // eslint-disable-line

const store = createStore({ initialState: preloadedState });

onPageLoad(() => {
  ReactDOM.hydrate(
    <ClientApp store={store} />,
    document.getElementById(startupConstants.ROOT_ID),
  );
});
