import React from 'react';
import PropTypes from 'prop-types';

import Widget1OptionSelector from './Widget1OptionSelector';
import { USAGE_TYPE } from '../../../../redux/constants/widget1Constants';

const Widget1OptionsUsage = props => (
  <Widget1OptionSelector
    options={Object.values(USAGE_TYPE)}
    className="usage-type"
    {...props}
  />
);

Widget1OptionsUsage.propTypes = {};

export default Widget1OptionsUsage;
