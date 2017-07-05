import React from 'react';
import PropTypes from 'prop-types';

import Slider from '/imports/ui/components/general/Slider.jsx';
import { T } from '/imports/ui/components/general/Translation.jsx';

const AdvancedOptions = props =>
  (<div>
    <hr />
    <div className="flex-col" style={{ width: '100%', maxWidth: 400 }}>
      <Slider
        label={<T id="AdvancedOptions.borrowRatio" />}
        id="borrowRatio"
        min={0}
        max={0.8}
        step={0.01}
        currentValue={props.options.borrowRatio}
        handleChange={props.changeOptions}
        labelMin="0%"
        labelMax="80%"
      />
    </div>
  </div>);

AdvancedOptions.propTypes = {
  options: PropTypes.objectOf(PropTypes.any).isRequired,
  changeOptions: PropTypes.func.isRequired,
};

export default AdvancedOptions;
