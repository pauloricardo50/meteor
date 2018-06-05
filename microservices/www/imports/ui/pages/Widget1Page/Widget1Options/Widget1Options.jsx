import React from 'react';
import PropTypes from 'prop-types';

import Widget1OptionsType from './Widget1OptionsType';
import Widget1OptionsUsage from './Widget1OptionsUsage';
import Widget1OptionsContainer from './Widget1OptionsContainer';

const Widget1Options = ({
  usageType,
  setUsageType,
  purchaseType,
  setPurchaseType,
}) => (
  <div className="widget1-options">
    <Widget1OptionsType onChange={setPurchaseType} value={purchaseType} />
    <Widget1OptionsUsage onChange={setUsageType} value={usageType} />
  </div>
);

Widget1Options.propTypes = {
  usageType: PropTypes.string.isRequired,
  purchaseType: PropTypes.string.isRequired,
  setUsageType: PropTypes.func.isRequired,
  setPurchaseType: PropTypes.func.isRequired,
};

export default Widget1OptionsContainer(Widget1Options);
