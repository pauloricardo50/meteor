import React from 'react';
import { renderToString } from 'react-dom/server';
import { onPageLoad } from 'meteor/server-render';
import { Helmet } from 'react-helmet';

import createStore from '../../redux/store';
import ServerApp from './ServerApp';

const prepareState = store => {
  const preloadedState = store.getState();
  // Make sure .replace always runs, as stringify can return undefined
  const stringifiedState = JSON.stringify(preloadedState) || '';

  return stringifiedState.replace(/</g, '\\u003c');
};

onPageLoad(sink => {
  const context = {};
  const store = createStore();
  const serverState = prepareState(store);

  sink.renderIntoElementById(
    'react-root',
    renderToString(
      <ServerApp store={store} context={context} location={sink.request.url} />
    )
  );

  const helmet = Helmet.renderStatic();
  sink.appendToHead(helmet.meta.toString());
  sink.appendToHead(helmet.title.toString());

  sink.appendToBody(`
    <script>
      window.__PRELOADED_STATE__ = ${serverState}
    </script>
  `);
});
