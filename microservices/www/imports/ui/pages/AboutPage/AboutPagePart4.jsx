import React from 'react';

import { T } from 'core/components/Translation';

const AboutPagePart4 = () => (
  <div className="about-page-part-4">
    <h2>
      <T id="AboutPagePart4.title" />
    </h2>
    <div className="about-page-part-4-list">
      <div>
        <h3>
          <T id="AboutPagePart4.subtitle1" />
        </h3>
        <p className="description">
          <T id="AboutPagePart4.description1" />
        </p>
      </div>
      <div>
        <h3>
          <T id="AboutPagePart4.subtitle2" />
        </h3>
        <p className="description">
          <T id="AboutPagePart4.description2" />
        </p>
      </div>
      <div>
        <h3>
          <T id="AboutPagePart4.subtitle3" />
        </h3>
        <p className="description">
          <T id="AboutPagePart4.description3" />
        </p>
      </div>
    </div>
  </div>
);

export default AboutPagePart4;
