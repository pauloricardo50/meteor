import React from 'react';

import { T } from 'core/components/Translation';
import HomePageHeaderBackground from './HomePageHeaderBackground';
import { Widget1Starter } from '../../../components/Widget1';

const HomePageHeader = () => (
  <header>
    <HomePageHeaderBackground />
    <div className="text">
      <h1>
        <T id="HomePageHeader.title" />
      </h1>
      <span className="separator" />
      <p>
        <T id="HomePageHeader.description" />
      </p>
    </div>
    <Widget1Starter />
  </header>
);

export default HomePageHeader;
