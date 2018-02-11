import React from 'react';
import ReactDOM from 'react-dom';
import { onPageLoad } from 'meteor/server-render';

import createStore from '../../redux/store';
import ClientApp from './ClientApp';

const preloadedState = window.__PRELOADED_STATE__; // eslint-disable-line
delete window.__PRELOADED_STATE__; // eslint-disable-line

const store = createStore({ initialState: preloadedState });

onPageLoad(() => {
  ReactDOM.hydrate(
    <ClientApp store={store} />,
    document.getElementById('react-root')
  );
});
