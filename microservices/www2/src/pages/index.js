/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { Link } from 'gatsby';
import Layout from '../components/Layout';

const Index = () => (
  <Layout>
    <div
      style={{
        padding: '100px',
        textAlign: 'center',
      }}
    >
      <h3>
        Gatsby default index page... will eventually be redirected to language
        specific home page
      </h3>
      <h4>
        <Link to="/fr/accueil">/fr/accueil</Link>
      </h4>
      <h4>
        <Link to="/en/home">/en/home</Link>
      </h4>
    </div>
  </Layout>
);

export default Index;
