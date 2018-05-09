import React from 'react';
import PropTypes from 'prop-types';

import { T } from 'core/components/Translation';
import Button from 'core/components/Button';

const CareersPageJob = ({ job: { title, url } }) => (
  <a href={url} target="_blank" className="careers-page-job">
    <h4>{title}</h4>
    <p className="careers-page-job-hover">Voir l'annonce</p>
  </a>
);

CareersPageJob.propTypes = {
  job: PropTypes.shape({
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default CareersPageJob;
