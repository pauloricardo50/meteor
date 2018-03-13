import React from 'react';

import Waves from '../../../components/Waves';
import HomePageFooterTop from './HomePageFooterTop';
import HomePageFooterLinks from './HomePageFooterLinks';
import HomePageFooterCopyright from './HomePageFooterCopyright';
import HomePageFooterSocial from './HomePageFooterSocial';

const HomePageFooter = () => (
  <footer>
    <Waves noSlope />
    <div className="home-page-footer-content">
      <HomePageFooterTop />
      <hr />
      <HomePageFooterLinks />
    </div>
    <HomePageFooterSocial />
    <HomePageFooterCopyright />
  </footer>
);

export default HomePageFooter;
