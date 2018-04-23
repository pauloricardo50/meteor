import React from 'react';

import { T } from 'core/components/Translation';
import HomePageProgression from './HomePageProgression';
import DescriptionItem from './DescriptionItem';
import HomePageDescriptionSeo from './HomePageDescriptionSeo';

const steps = [
  { id: 'eligibility' },
  { id: 'expertise' },
  { id: 'application' },
  { id: 'auction' },
  { id: 'closing' },
];

const HomePageDescription = () => (
  <div className="home-page-description">
    <b>
      <h2 className="title">
        <T id="HomePageDescription.seoTitle" />
      </h2>
    </b>
    <HomePageDescriptionSeo />
    <b>
      <h2 className="seo-title">
        <T id="HomePageDescription.stepsTitle" />
      </h2>
    </b>
    <div className="steps">
      {steps.map((step, index) => (
        <DescriptionItem nb={index + 1} key={step.id} step={step} />
      ))}
      <HomePageProgression />
    </div>
  </div>
);

export default HomePageDescription;
