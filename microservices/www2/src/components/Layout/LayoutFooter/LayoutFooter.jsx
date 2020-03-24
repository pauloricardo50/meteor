import React from 'react';
import LayoutFooterLinks from './LayoutFooterLinks';
import LayoutFooterInfo from './LayoutFooterInfo';

const LayoutFooter = ({ i18n }) => (
  <footer>
    <LayoutFooterLinks />
    <LayoutFooterInfo />
  </footer>
);

export default LayoutFooter;
