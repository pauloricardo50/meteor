import React from 'react';

import { T } from 'core/components/Translation';

const AboutPagePart2 = () => (
  <div className="about-page-part-2">
    <div className="about-page-part-2-left">
      <h2>
        <T id="AboutPagePart2.title" />
      </h2>
      <p className="description">
        <T id="AboutPagePart2.description1" />
      </p>
      <p className="description">
        <T id="AboutPagePart2.description2" />
      </p>
    </div>
    <div className="about-page-part-2-right">
      <h3>
        <T id="AboutPagePart2.subtitle1" />
      </h3>
      <p className="description">
        <T id="AboutPagePart2.description3" />
      </p>
      <h3>
        <T id="AboutPagePart2.subtitle2" />
      </h3>
      <p className="description">
        <T id="AboutPagePart2.description4" />
      </p>
    </div>
  </div>
);

export default AboutPagePart2;
