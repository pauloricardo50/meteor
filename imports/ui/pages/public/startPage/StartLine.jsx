import React, { Component, PropTypes } from 'react';
import { Motion, spring, presets } from 'react-motion';
import classNames from 'classnames';

import TextField from 'material-ui/TextField';
import Slider from 'material-ui/Slider';
import AddIcon from 'material-ui/svg-icons/content/add';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import MaskedInput from 'react-text-mask';

import { swissFrancMask } from '/imports/js/helpers/textMasks';

const primaryColor = '#4A90E2';

const defaultStyle = {
  color: primaryColor,
  borderColor: primaryColor,
  position: 'absolute',
  bottom: -8,
};
const errorStyle = {
  position: 'absolute',
  bottom: -8,
};

// Use a class to allow input focusing with ref using this.input
export default class StartLine extends Component {
  render() {
    return (
      <Motion
        defaultStyle={{ x: 0 }}
        style={{ x: spring(this.props.value, presets.gentle) }}
      >
        {value => (
          <article
            className={classNames({
              'oscar-line': true,
              property: this.props.name === 'property',
            })}
          >
            <label htmlFor={this.props.name}>{this.props.label}</label>
            <div className="text-div">
              <TextField
                id={this.props.name}
                name={this.props.name}
                onChange={e =>
                  this.props.setStateValue(this.props.name, e.target.value)}
                errorStyle={
                  this.props.minValue <= this.props.value
                    ? defaultStyle
                    : errorStyle
                }
                className="input"
                hintText="CHF"
                ref={c => {
                  this.input = c;
                }}
                type="text"
              >
                <MaskedInput
                  type="text"
                  value={
                    (this.props.auto
                      ? Math.round(value.x)
                      : this.props.value) || ''
                  }
                  mask={swissFrancMask}
                  guide
                  pattern="[0-9]*"
                  // ref={c => {
                  //   this.input = c;
                  // }}
                />
              </TextField>
              <span
                className={classNames({
                  reset: true,
                  off: this.props.value === 0,
                })}
              >
                <CloseIcon
                  onTouchTap={() => {
                    this.props.setStateValue(this.props.name, 0, true);
                    this.input.input.inputElement.focus();
                  }}
                  disabled={this.props.value === 0}
                />
              </span>
            </div>
            <Slider
              value={
                value.x < 5000
                  ? 0
                  : Math.min(
                      Math.round(this.props.auto ? value.x : this.props.value) /
                        this.props.sliderMax,
                      1,
                    )
              }
              onChange={(e, v) =>
                this.props.setStateValue(
                  this.props.name,
                  v * this.props.sliderMax,
                )}
              step={10000 / this.props.sliderMax}
              className="slider"
            />
            {this.props.value >= this.props.sliderMax &&
              <div className="sliderMaxButton animated fadeIn">
                <AddIcon
                  onTouchTap={this.props.setSliderMax}
                  style={{ cursor: 'pointer' }}
                />
              </div>}
          </article>
        )}
      </Motion>
    );
  }
}

StartLine.propTypes = {
  value: PropTypes.number.isRequired,
  setStateValue: PropTypes.func.isRequired,
  setSliderMax: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  sliderMax: PropTypes.number.isRequired,
  minValue: PropTypes.number.isRequired,
  auto: PropTypes.bool.isRequired,
};
