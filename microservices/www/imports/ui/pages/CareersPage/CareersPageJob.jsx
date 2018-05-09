import React from 'react';
import PropTypes from 'prop-types';

import { T } from 'core/components/Translation';
import Button from 'core/components/Button';

const CareersPageJob = ({ job: { title, url } }) => (
  <div className="careers-page-job card1">
    <h3>{title}</h3>
    <a href={url} target="_blank">
      <Button raised primary>
        <T id="CareersPageJob.button" />
      </Button>
    </a>
  </div>
);

CareersPageJob.propTypes = {
  job: PropTypes.shape({
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default CareersPageJob;
