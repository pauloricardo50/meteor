import React from 'react';
import PropTypes from 'prop-types';

import T from 'core/components/Translation';

const CareersPageJob = ({ job: { title, url } }) => (
  <a href={url} target="_blank" className="careers-page-job card1">
    <h4>{title}</h4>
    <p className="careers-page-job-hover">
      <T id="CareersPageJob.hoverText" />
    </p>
  </a>
);

CareersPageJob.propTypes = {
  job: PropTypes.shape({
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default CareersPageJob;
