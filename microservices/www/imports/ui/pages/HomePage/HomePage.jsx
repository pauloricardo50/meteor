import React from 'react';
import PropTypes from 'prop-types';

import HomePageInterestRates from './HomePageInterestRates';
import HomePageNav from './HomePageNav';
import HomePageHeader from './HomePageHeader';
import HomePagePartners from './HomePagePartners';
import HomePageDescription from './HomePageDescription';
import HomePageReviews from './HomePageReviews';
import HomePageNewsletter from './HomePageNewsletter';
import HomePageFooter from './HomePageFooter';

const HomePage = () => (
  <main className="home-page">
    <HomePageInterestRates />
    <HomePageNav />
    <HomePageHeader />
    <HomePagePartners />
    <HomePageDescription />
    <HomePageReviews />
    {/* <HomePageNewsletter /> */}
    <HomePageFooter />
  </main>
);

HomePage.propTypes = {};

export default HomePage;
