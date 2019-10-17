import { onPageLoad } from 'meteor/server-render';

import React from 'react';
import { renderToString } from 'react-dom/server';
import { Helmet } from 'react-helmet';
import { ServerStyleSheets } from '@material-ui/core/styles';

import createStore from '../../redux';
import * as startupConstants from '../shared/startupConstants';
import ServerApp from './ServerApp';
import { setHeaders } from './seo';

const prepareState = (store) => {
  const preloadedState = store.getState();
  // Make sure .replace always runs, as stringify can return undefined
  const stringifiedState = JSON.stringify(preloadedState) || '';

  return stringifiedState.replace(/</g, '\\u003c');
};

onPageLoad(async (sink) => {
  const context = {};
  const { store } = createStore();
  const serverState = prepareState(store);
  const sheets = new ServerStyleSheets();

  await setHeaders(sink);

  sink.renderIntoElementById(
    startupConstants.ROOT_ID,
    // Can't use the new "renderToNodeStream" because of JSS
    // See this issue: https://github.com/mui-org/material-ui/issues/8503
    renderToString(sheets.collect(<ServerApp
      store={store}
      context={context}
      location={sink.request.url}
    />)),
  );

  const helmet = Helmet.renderStatic();
  sink.appendToHead(helmet.meta.toString());
  sink.appendToHead(helmet.title.toString());

  sink.appendToBody(`
    <script>
      window.${startupConstants.REDUX_STORE_KEY} = ${serverState}
    </script>
  `);

  // Get the CSS after it's been rendered by the server
  // And inject it to the client
  const css = sheets.toString();
  sink.appendToHead(`
    <style id="jss-server-side">
      ${css}
    </style>
  `);
});
