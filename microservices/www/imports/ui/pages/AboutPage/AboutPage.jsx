import React from 'react';

import WwwLayout from '../../WwwLayout';
import AboutPagePart1 from './AboutPagePart1';
import AboutPagePart2 from './AboutPagePart2';
import AboutPagePart3 from './AboutPagePart3';
import AboutPagePart4 from './AboutPagePart4';
import AboutPageTeam from './AboutPageTeam';
import AboutPageOffice from './AboutPageOffice';

const AboutPage = () => (
  <WwwLayout className="about-page">
    <WwwLayout.TopNav />
    <AboutPagePart1 />
    <AboutPagePart2 />
    <AboutPagePart3 />
    <AboutPagePart4 />
    <AboutPageTeam />
    <AboutPageOffice />
    <WwwLayout.Footer />
  </WwwLayout>
);

export default AboutPage;
