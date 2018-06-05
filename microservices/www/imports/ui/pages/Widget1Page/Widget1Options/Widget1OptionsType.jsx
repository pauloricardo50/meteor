import React from 'react';
import PropTypes from 'prop-types';

import Widget1OptionSelector from './Widget1OptionSelector';
import { PURCHASE_TYPE } from '../../../../redux/constants/widget1Constants';

const Widget1OptionsType = props => (
  <Widget1OptionSelector
    options={Object.values(PURCHASE_TYPE)}
    className="purchase-type"
    {...props}
  />
);

Widget1OptionsType.propTypes = {};

export default Widget1OptionsType;
