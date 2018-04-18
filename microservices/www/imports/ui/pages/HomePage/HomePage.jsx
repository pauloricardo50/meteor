import React from 'react';

import HomePageInterestRates from './HomePageInterestRates';
import HomePageHeader from './HomePageHeader';
import HomePagePartners from './HomePagePartners';
import HomePageDescription from './HomePageDescription';
import HomePageReviews from './HomePageReviews';
import HomePageNewsletter from './HomePageNewsletter';
import WwwTopNav from '../../components/WwwTopNav';
import WwwFooter from '../../components/WwwFooter/';

const HomePage = () => (
  <main className="page home-page">
    {/* <HomePageInterestRates /> */}
    <WwwTopNav />
    <HomePageHeader />
    <HomePagePartners />
    <HomePageDescription />
    <HomePageReviews />
    {/* <HomePageNewsletter /> */}
    <WwwFooter transparent />
  </main>
);

export default HomePage;
