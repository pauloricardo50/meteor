/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import Layout from '../components/Layout';

// TODO: localize the content in this page
// TODO: make sure home redirect is localized as well
export default () => (
  <Layout>
    <div className="not-found">
      <h1>404</h1>
      <h2>Page not found</h2>
      <p>
        <a href="/">Return to homepage</a>
      </p>
    </div>
  </Layout>
);
