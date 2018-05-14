import React from 'react';

import { T } from 'core/components/Translation';
import Icon from 'core/components/Icon';

const AboutPagePart2 = () => (
  <div className="about-page-part-2">
    <h2>
      <T id="AboutPagePart2.title" />
    </h2>
    <div className="about-page-part-2-content">
      <div className="about-page-part-2-left">
        <div className="icon-circle-error">
          <div className="icon-error">
            <Icon type="close" />
          </div>
        </div>
        <span>
          <h3>
            <T id="AboutPagePart2.title1" />
          </h3>
          <p className="description">
            <T id="AboutPagePart2.description1" />
          </p>
        </span>
      </div>
      <div className="about-page-part-2-right">
        <div className="icon-circle-success">
          <div className="icon-success">
            <Icon type="check" />
          </div>
        </div>
        <span>
          <h3>
            <T id="AboutPagePart2.title2" />
          </h3>
          <p className="description">
            <T id="AboutPagePart2.description2" />
          </p>
        </span>
      </div>
    </div>
  </div>
);

export default AboutPagePart2;
