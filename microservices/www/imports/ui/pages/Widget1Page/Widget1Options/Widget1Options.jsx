import React from 'react';
import PropTypes from 'prop-types';

import Widget1OptionsType from './Widget1OptionsType';
import Widget1OptionsContainer from './Widget1OptionsContainer';

const Widget1Options = ({ purchaseType, setPurchaseType }) => (
  <div className="widget1-options">
    <Widget1OptionsType onChange={setPurchaseType} value={purchaseType} />
  </div>
);

Widget1Options.propTypes = {
  purchaseType: PropTypes.string.isRequired,
  setPurchaseType: PropTypes.func.isRequired,
};

export default Widget1OptionsContainer(Widget1Options);
