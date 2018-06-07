import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

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
      >
        <h4>
          <T id={`AboutPagePart4.title${index}`} />
        </h4>
      </div>
    ))}
  </div>
);

AboutPagePart4Tabs.propTypes = {
  setIndex: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};

export default AboutPagePart4Tabs;
