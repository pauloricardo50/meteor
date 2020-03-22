import React from 'react';

import Layout from '../Layout';
import SEO from '../Seo';

const WwwPage = ({ children, title, description }) => (
  <>
    <SEO title={title} description={description} />
    <Layout>{children}</Layout>
  </>
);

export default WwwPage;
