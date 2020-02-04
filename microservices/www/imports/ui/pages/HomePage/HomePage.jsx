import React from 'react';

import PageHead from 'core/components/PageHead';
import HomePageHeader from './HomePageHeader';
import HomePageDescription from './HomePageDescription';
import HomePageReviews from './HomePageReviews';
import WwwLayout from '../../WwwLayout';
import { VARIANTS } from '../../WwwLayout/WwwTopNav';

const HomePage = () => (
  <WwwLayout className="home-page">
    <PageHead
      titleId="HomePageHeader.title"
      descriptionId="HomePageHeader.description"
    />
    <WwwLayout.TopNav variant={VARIANTS.WHITE} />
    <WwwLayout.Content>
      <HomePageHeader />
      <HomePageDescription />
      <HomePageReviews />
    </WwwLayout.Content>
    <WwwLayout.Footer />
  </WwwLayout>
);

export default HomePage;
