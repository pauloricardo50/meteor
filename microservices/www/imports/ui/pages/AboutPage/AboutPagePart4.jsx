import React from 'react';
import PropTypes from 'prop-types';

import { withState } from 'recompose';
import T from 'core/components/Translation';
import AboutPagePart4Tabs from './AboutPagePart4Tabs';

const AboutPagePart4 = ({ index, setIndex }) => (
  <div className="about-page-part-4">
    <AboutPagePart4Tabs setIndex={setIndex} index={index} />
    <div className="about-page-part-4-content">
      <div className="about-page-part-4-text">
        <h3>
          <T id={`AboutPagePart4.title${index}`} />
        </h3>
        <p className="description">
          <T id={`AboutPagePart4.description${index}`} />
        </p>
      </div>
      <div
        className="about-page-part-4-image"
        style={{ backgroundImage: `url(/img/AboutPagePart4Image${index}.jpg)` }}
      />
    </div>
  </div>
);

AboutPagePart4.propTypes = {
  index: PropTypes.number.isRequired,
  setIndex: PropTypes.func.isRequired,
};

export default withState('index', 'setIndex', 0)(AboutPagePart4);
