import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import T from 'core/components/Translation';

const indexes = [0, 1, 2];

const AboutPagePart4Tabs = ({ setIndex, index: activeIndex }) => (
  <div className="about-page-part-4-tabs">
    {indexes.map(index => (
      <div
        className={classnames({
          'about-page-part-4-tabs-tab': true,
          active: activeIndex === index,
        })}
        key={index}
        onClick={() => setIndex(index)}
        onMouseEnter={() => setIndex(index)}
      >
        <h4>
          <T id={`AboutPagePart4.title${index}`} />
        </h4>
      </div>
    ))}
  </div>
);

AboutPagePart4Tabs.propTypes = {
  index: PropTypes.number.isRequired,
  setIndex: PropTypes.func.isRequired,
};

export default AboutPagePart4Tabs;
