import React from 'react';

import SEO from '../Seo';

const WwwPage = ({ children, title, description }) => (
  <>
    <SEO title={title} description={description} />
    {children}
  </>
);

export default WwwPage;
