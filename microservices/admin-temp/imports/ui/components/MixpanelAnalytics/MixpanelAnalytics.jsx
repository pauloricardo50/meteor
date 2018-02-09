import React from 'react';
import PropTypes from 'prop-types';

import getMixpanelData from './getMixpanelData';

const MixpanelAnalytics = ({ loan: { userId } }) => {
    const mixpanelResult = getMixpanelData(userId);
    return <div>Hello World</div>;
};

MixpanelAnalytics.propTypes = {};

export default MixpanelAnalytics;
