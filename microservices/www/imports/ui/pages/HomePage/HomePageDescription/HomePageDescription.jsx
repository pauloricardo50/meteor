import React from 'react';

import { T } from 'core/components/Translation';
import HomePageProgression from './HomePageProgression';
import DescriptionItem from './DescriptionItem';

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
        <T id="HomePageDescription.title" />
      </h2>
    </b>
    <p className="description">
      <T id="HomePageDescription.description" />
    </p>
    <div className="steps">
      {steps.map((step, index) => (
        <DescriptionItem nb={index + 1} key={step.id} step={step} />
      ))}
      <HomePageProgression />
    </div>
  </div>
);

export default HomePageDescription;
