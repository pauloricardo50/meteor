import React from 'react';
import { renderToString } from 'react-dom/server';
import { onPageLoad } from 'meteor/server-render';
import { Helmet } from 'react-helmet';

import createStore from '../../redux/store';
import * as startupConstants from '../shared/startupConstants';
import ServerApp from './ServerApp';
import MaterialUiServer from '../shared/MaterialUi/MaterialUiServer';
import setupMaterialUiServer from '../shared/MaterialUi/setupMaterialUiServer';

const prepareState = (store) => {
  const preloadedState = store.getState();
  // Make sure .replace always runs, as stringify can return undefined
  const stringifiedState = JSON.stringify(preloadedState) || '';

  return stringifiedState.replace(/</g, '\\u003c');
};

onPageLoad((sink) => {
  const context = {};
  const { store } = createStore();
  const serverState = prepareState(store);
  const { registry, generateClassName } = setupMaterialUiServer();

  sink.renderIntoElementById(
    startupConstants.ROOT_ID,
    // Can't use the new "renderToNodeStream" because of JSS
    // See this issue: https://github.com/mui-org/material-ui/issues/8503
    renderToString(<MaterialUiServer
      registry={registry}
      generateClassName={generateClassName}
    >
      <ServerApp
        store={store}
        context={context}
        location={sink.request.url}
      />
    </MaterialUiServer>),
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
  const css = registry.toString();
  sink.appendToBody(`
    <style id="jss-server-side">
      ${css}
    </style>
  `);
});
