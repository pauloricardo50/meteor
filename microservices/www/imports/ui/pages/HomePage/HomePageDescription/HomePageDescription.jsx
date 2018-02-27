import React from 'react';

import { T } from 'core/components/Translation';
import HomePageProgression from './HomePageProgression';

const HomePageDescription = () => (
  <div className="home-page-description">
    <h2 className="title">
      <T id="HomePageDescription.title" />
    </h2>
    <div className="steps">
      <HomePageProgression />
    </div>
  </div>
);

export default HomePageDescription;
