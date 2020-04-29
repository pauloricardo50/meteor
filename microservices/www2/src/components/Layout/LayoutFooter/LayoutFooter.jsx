import React from 'react';

import LayoutFooterInfo from './LayoutFooterInfo';
import LayoutFooterLinks from './LayoutFooterLinks';

const LayoutFooter = ({ i18n }) => (
  <footer>
    <LayoutFooterLinks />
    <LayoutFooterInfo />
  </footer>
);

export default LayoutFooter;
