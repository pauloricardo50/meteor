import './PageHeading.scss';

import React from 'react';

import { RichText } from '../prismic';

const PageHeading = ({ primary }) => (
  <div className="page-heading container">
    <div>
      <RichText render={primary.page_heading} />
    </div>
  </div>
);

export default PageHeading;
