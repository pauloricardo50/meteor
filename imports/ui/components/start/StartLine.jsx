import React, { PropTypes } from 'react';
import { Motion, spring, presets } from 'react-motion';
import classNames from 'classnames';

import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Slider from 'material-ui/Slider';
import AddIcon from 'material-ui/svg-icons/content/add';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import MaskedInput from 'react-text-mask';

import { swissFrancMask } from '/imports/js/textMasks';

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

const StartLine = props => (
  <Motion defaultStyle={{ x: 0 }} style={{ x: spring(props.value, presets.gentle) }}>
    {value =>
      <article className={classNames({ 'oscar-line': true, property: props.name === 'property' })} >
        <label htmlFor={props.name}>{props.label}</label>
        <div className="text-div">
          <TextField
            id={props.name}
            name={props.name}
            onChange={e => props.setStateValue(props.name, e.target.value)}
            errorStyle={props.minValue <= props.value ? defaultStyle : errorStyle}
            className="input"
            hintText="CHF"
          >
            <MaskedInput
              value={(props.auto ? Math.round(value.x) : props.value) || ''}
              mask={swissFrancMask}
              guide
              pattern="[0-9]*"
            />
          </TextField>
          <span className={classNames({ reset: true, off: props.value === 0 })}>
            <CloseIcon
              onTouchTap={() => props.setStateValue(props.name, 0, true)}
              disabled={props.value === 0}
            />
          </span>
        </div>
        <Slider
          value={value.x < 5000
            ? 0
            : Math.min(
                Math.round(props.auto ? value.x : props.value) / props.sliderMax,
                1,
          )}
          onChange={(e, v) => props.setStateValue(props.name, v * props.sliderMax)}
          step={10000 / props.sliderMax}
          className="slider"
        />
        {props.value >= props.sliderMax &&
          <div className="sliderMaxButton animated fadeIn">
            <AddIcon onTouchTap={props.setSliderMax} style={{ cursor: 'pointer' }} />
          </div>
        }
      </article>
    }
  </Motion>
);

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

export default StartLine;
