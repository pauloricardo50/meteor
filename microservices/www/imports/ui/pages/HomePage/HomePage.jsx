import React from 'react';

import PageHead from 'core/components/PageHead';
// import HomePageInterestRates from './HomePageInterestRates';
import HomePageHeader from './HomePageHeader';
// import HomePagePartners from './HomePagePartners';
import HomePageDescription from './HomePageDescription';
import HomePageReviews from './HomePageReviews';
// import HomePageNewsletter from './HomePageNewsletter';
import WwwLayout from '../../WwwLayout';
import { VARIANTS } from '../../WwwLayout/WwwTopNav';

const HomePage = () => (
  <WwwLayout className="home-page">
    <PageHead
      titleId="HomePageHeader.title"
      descriptionId="HomePageHeader.description"
    />
    {/* <HomePageInterestRates /> */}
    <WwwLayout.TopNav variant={VARIANTS.WHITE} />
    <WwwLayout.Content>
      <HomePageHeader />
      {/* <HomePagePartners /> */}
      <HomePageDescription />
      <HomePageReviews />
      {/* <HomePageNewsletter /> */}
    </WwwLayout.Content>
    <WwwLayout.Footer />
  </WwwLayout>
);

export default HomePage;