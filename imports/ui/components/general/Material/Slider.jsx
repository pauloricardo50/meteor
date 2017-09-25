import React from 'react';

import RcSlider from 'rc-slider';

import colors from '/imports/js/config/colors';

const styles = {
  color: {
    color: colors.primary,
  },
};

const Slider = props => <RcSlider {...props} />;

Slider.propTypes = {};

export default Slider;
