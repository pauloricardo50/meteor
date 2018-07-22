import React from 'react';

import MixpanelAnalytics from '../../../components/MixpanelAnalytics';

const AnalyticsTab = ({ loan }) => (
  <React.Fragment>
    <MixpanelAnalytics loan={loan} />
  </React.Fragment>
);

export default AnalyticsTab;
