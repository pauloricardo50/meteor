import React from 'react';

import PageHead from 'core/components/PageHead';
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
    <PageHead
      titleId="AboutPagePart1.title"
      descriptionId="AboutPagePart1.description"
    />
    <WwwLayout.TopNav variant={VARIANTS.WHITE} />
    <AboutPagePart1 />
    <AboutPagePart2 />
    <AboutPageTeam />
    <AboutPagePart3 />
    <AboutPagePart4 />
    <AboutPageOffice />
    <WwwLayout.Footer />
  </WwwLayout>
);

export default AboutPage;
