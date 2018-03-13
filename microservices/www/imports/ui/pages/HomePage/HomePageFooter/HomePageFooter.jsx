import React from 'react';

import Waves from '../../../components/Waves';
import HomePageFooterTop from './HomePageFooterTop';
import HomePageFooterLinks from './HomePageFooterLinks';
import HomePageFooterCopyright from './HomePageFooterCopyright';

const HomePageFooter = () => (
  <footer>
    <Waves noSlope />
    <div className="home-page-footer-content">
      <HomePageFooterTop />
      <hr />
      <HomePageFooterLinks />
    </div>
    <HomePageFooterCopyright />
  </footer>
);

export default HomePageFooter;
