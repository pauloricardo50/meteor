import './PageHeading.scss';

import React from 'react';

import { RichText } from '../prismic';

const PageHeading = ({ primary }) => (
  <div className="page-heading container">
    <RichText render={primary.page_heading} />
    {primary.page_description && <RichText render={primary.page_description} />}
  </div>
);

export default PageHeading;
