import React from 'react';

import Widget1OptionSelector from './Widget1OptionSelector';
import { PURCHASE_TYPE } from '../../../../redux/constants/widget1Constants';

const Widget1OptionsType = props => (
  <Widget1OptionSelector
    options={Object.values(PURCHASE_TYPE)}
    className="purchase-type"
    {...props}
  />
);

export default Widget1OptionsType;
