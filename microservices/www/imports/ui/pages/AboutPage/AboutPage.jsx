import React from 'react';

import WwwLayout from '../../WwwLayout';
import { VARIANTS } from '../../WwwLayout/WwwTopNav';
import AboutPagePart1 from './AboutPagePart1';
import AboutPagePart2 from './AboutPagePart2';
import AboutPagePart3 from './AboutPagePart3';
import AboutPagePart4 from './AboutPagePart4';
import AboutPageTeam from './AboutPageTeam';
import AboutPageOffice from './AboutPageOffice';

const AboutPage = () => (
  <WwwLayout className="about-page">
    <WwwLayout.TopNav variant={VARIANTS.WHITE} />
    <main className="www-main">
      <AboutPagePart1 />
      <AboutPagePart2 />
      <AboutPageTeam />
      <AboutPagePart3 />
      <AboutPagePart4 />
      <AboutPageOffice />
    </main>
    <WwwLayout.Footer />
  </WwwLayout>
);

export default AboutPage;
