import React from 'react';

import T from 'core/components/Translation';
import Button from 'core/components/Button';

const AboutPagePart3 = () => (
  <div className="about-section about-page-part-3">
    <div className="card1 about-page-part-3-left">
      <h3>
        <T id="AboutPagePart3.title1" />
      </h3>
      <p className="description">
        <T id="AboutPagePart3.description1" />
      </p>
    </div>
    <div className="card1 about-page-part-3-left">
      <h3>
        <T id="AboutPagePart3.title2" />
      </h3>
      <p className="description">
        <T id="AboutPagePart3.description2" />
      </p>
    </div>
  </div>
);

export default AboutPagePart3;
