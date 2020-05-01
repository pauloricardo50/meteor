/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import Layout from '../components/Layout';

const Index = () => (
  <Layout>
    <div
      style={{
        padding: '100px',
        textAlign: 'center',
      }}
    >
      Gatsby index page... will eventually be redirected to either{' '}
      <strong>/fr/accueil</strong> or <strong>/en/home</strong>, depending upon
      language (also considering just /fr/ and /en/)
    </div>
  </Layout>
);

export default Index;
