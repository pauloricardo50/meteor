import React from 'react';

const TrendIcon = ({ trend }) => (
  <div className={`trend-icon trend-icon--${trend.toLowerCase()}`}>→</div>
);

export default TrendIcon;
