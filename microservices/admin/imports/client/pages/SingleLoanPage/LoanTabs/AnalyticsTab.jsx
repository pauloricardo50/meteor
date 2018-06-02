import React from 'react';

import MixpanelAnalytics from '../../../components/MixpanelAnalytics';

const AnalyticsTab = ({ loan }) => (
  <div className="mask1">
    <MixpanelAnalytics loan={loan} />
  </div>
);

export default AnalyticsTab;
