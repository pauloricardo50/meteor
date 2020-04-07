import React from 'react';
import PropTypes from 'prop-types';

import Icon from '../Icon';
import { TRENDS } from './interestRates';

const InterestsTableTrend = ({ trend }) => {
  let icon;

  switch (trend) {
    case TRENDS.UP:
      icon = 'trendingUp';
      break;
    case TRENDS.DOWN:
      icon = 'trendingDown';
      break;
    case TRENDS.FLAT:
      icon = 'trendingFlat';
      break;
    default:
      return null;
  }

  return (
    <span className={`interests-table-trend ${trend}`}>
      <Icon type={icon} />
    </span>
  );
};

InterestsTableTrend.propTypes = {
  trend: PropTypes.string.isRequired,
};

export default InterestsTableTrend;
