import React from 'react';

import Layout from '../Layout';

const WwwPage = ({ pageContext }) => (
  <Layout>
    <h1>{pageContext.slug}</h1>
    <p>Hello from WwwPage</p>
  </Layout>
);

export default WwwPage;
