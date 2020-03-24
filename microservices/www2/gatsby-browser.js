import React from 'react';
import Layout from './src/components/Layout';
import meteorClient, { MeteorClientContext } from './src/utils/meteorClient';

import './src/styles/main.scss';

export const wrapPageElement = ({ element, props }) => (
  <Layout {...props}>{element}</Layout>
);

export const wrapRootElement = ({ element }) => (
  <MeteorClientContext.Provider value={meteorClient}>
    {element}
  </MeteorClientContext.Provider>
);
