import React from 'react';
import PropTypes from 'prop-types';

import HomePageNav from './HomePageNav';
import HomePageHeader from './HomePageHeader';
import HomePageDescription from './HomePageDescription';
import HomePageReviews from './HomePageReviews';
import HomePageNewsletter from './HomePageNewsletter';
import HomePageFooter from './HomePageFooter';

const HomePage = () => (
    <main className="home-page">
        <HomePageNav />
        <HomePageHeader />
        <HomePageDescription />
        <HomePageReviews />
        <HomePageNewsletter />
        <HomePageFooter />
    </main>
);

HomePage.propTypes = {};

export default HomePage;
