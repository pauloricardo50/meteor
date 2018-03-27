import React from 'react';
import PropTypes from 'prop-types';

import Button from 'core/components/Button';
import { T } from 'core/components/Translation';

const DashboardProgressInfo = ({ currentLink, currentItemId }) => (
  <div className="dashboard-progress-info">
    <div className="text">
      <p>
        <b>
          <T id={`steps.${currentItemId}.title`} />
        </b>
      </p>
    </div>
    <Button
      variant="raised"
      color="secondary"
      link={!!currentLink}
      to={currentLink}
    >
      <T id="general.continue" />
    </Button>
  </div>
);

DashboardProgressInfo.propTypes = {};

export default DashboardProgressInfo;
