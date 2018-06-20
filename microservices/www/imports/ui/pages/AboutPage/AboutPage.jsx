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
    <WwwLayout.Content>
      <AboutPagePart1 />
      <AboutPagePart2 />
      <AboutPageTeam />
      <AboutPagePart3 />
      <AboutPagePart4 />
      <AboutPageOffice />
    </WwwLayout.Content>
    <WwwLayout.Footer />
  </WwwLayout>
);

export default AboutPage;
