import React from 'react';

import Widget1OptionSelector from './Widget1OptionSelector';
import { widget1Constants } from '../../../../redux/widget1';

const Widget1OptionsType = props => (
  <Widget1OptionSelector
    options={Object.values(widget1Constants.PURCHASE_TYPE)}
    className="purchase-type"
    {...props}
  />
);

export default Widget1OptionsType;
