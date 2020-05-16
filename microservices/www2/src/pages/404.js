/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import Layout from '../components/Layout';

// TODO: get updated NotFound component from core to handle localization
export default () => (
  <Layout pageContext={{ lang: '', type: '404' }} pageName="404">
    <div className="not-found">
      <h1>404</h1>
      <h2>Page not found</h2>
      <p>
        <a href="/">Return to homepage</a>
      </p>
    </div>
  </Layout>
);
