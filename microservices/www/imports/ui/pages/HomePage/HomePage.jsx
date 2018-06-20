import React from 'react';

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