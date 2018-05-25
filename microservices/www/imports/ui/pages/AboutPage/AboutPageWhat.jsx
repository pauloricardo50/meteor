import React from 'react';

import T from 'core/components/Translation';
import Icon from 'core/components/Icon';

const AboutPageWhat = () => (
  <div className="about-page-what">
    <T id="AboutPageWhat.title" />
    <div className="about-page-part-2-left">
      <Icon icon="close" />
      <T id="AboutPageWhat.description1.1" />
      <T id="AboutPageWhat.description1.2" />
    </div>
    <div className="about-page-part-2-right">
      <Icon icon="check" />
      <T id="AboutPageWhat.description2" />
    </div>
  </div>
);

export default AboutPageWhat;
