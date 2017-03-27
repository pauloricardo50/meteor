import React, { PropTypes } from 'react';

import Slider from 'material-ui/Slider';
import { toNumber } from '/imports/js/helpers/conversionFunctions';

export default class StartSlider extends React.Component {
  handleChange(event) {
    // Save a Number if it is money, else the string
    const value = this.props.money
      ? toNumber(event.target.value)
      : event.target.value;
    this.props.setFormState(this.props.id, value, () => null);
  }

  render() {
    const val = this.props.value || this.props.formState[this.props.id];
    return (
      <Slider
        min={this.props.sliderMin}
        max={this.props.sliderMax}
        step={(this.props.sliderMax - this.props.sliderMin) / 100}
        name={this.props.id}
        value={Math.min(
          Math.max(val, this.props.sliderMin),
          this.props.sliderMax,
        )}
        onChange={(e, v) => this.props.setFormState(this.props.id, v)}
        onDragStart={() => this.props.setActiveLine(this.props.id)}
        style={{ padding: '0 40px' }}
      />
    );
  }
}

StartSlider.propTypes = {
  id: PropTypes.string.isRequired,
  setFormState: PropTypes.func.isRequired,
  formState: PropTypes.objectOf(PropTypes.any),
  money: PropTypes.bool,
  value: PropTypes.any,
  sliderMax: PropTypes.number.isRequired,
  sliderMin: PropTypes.number.isRequired,
  setActiveLine: PropTypes.func.isRequired,
};

StartSlider.defaultProps = {};
