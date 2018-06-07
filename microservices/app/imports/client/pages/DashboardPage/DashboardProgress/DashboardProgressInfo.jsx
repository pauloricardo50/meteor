import React from 'react';
import PropTypes from 'prop-types';

import Button from 'core/components/Button';
import Icon from 'core/components/Icon';
import T from 'core/components/Translation';

const DashboardProgressInfo = ({ currentLink, currentItemId }) => (
  <div className="dashboard-progress-info">
    <div className="text">
      <Icon className="icon" type="radioButtonChecked" />
      <p>
        <b>
          <T id={`steps.${currentItemId}.title`} />
        </b>
      </p>
    </div>
    <Button raised secondary link={!!currentLink} to={currentLink}>
      <T id="general.continue" />
    </Button>
  </div>
);

DashboardProgressInfo.propTypes = {
  currentLink: PropTypes.string,
  currentItemId: PropTypes.string.isRequired,
};

DashboardProgressInfo.defaultProps = {
  currentLink: undefined,
};

export default DashboardProgressInfo;
