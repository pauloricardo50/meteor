import React, { PropTypes } from 'react';

import classNames from 'classnames';

import TextField from 'material-ui/TextField';
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

let input;

const Start1Text = props => (
  <div className="text-div">
    <TextField
      id={props.name}
      name={props.name}
      onChange={e => props.setStateValue(props.name, e.target.value)}
      errorStyle={props.minValue <= props.value ? defaultStyle : errorStyle}
      className="input"
      hintText="CHF"
      ref={c => {
        input = c;
      }}
      type="text"
    >
      <MaskedInput
        type="text"
        value={(props.auto ? Math.round(props.motionValue) : props.value) || ''}
        mask={swissFrancMask}
        guide
        pattern="[0-9]*"
      />
    </TextField>
    <span
      className={classNames({
        reset: true,
        off: props.value === 0,
      })}
    >
      <CloseIcon
        onTouchTap={() => {
          props.setStateValue(props.name, 0, true);
          if (input) {
            input.input.inputElement.focus();
          }
        }}
        disabled={props.value === 0}
      />
    </span>
  </div>
);

Start1Text.propTypes = {
  value: PropTypes.number.isRequired,
  motionValue: PropTypes.number.isRequired,
  setStateValue: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  minValue: PropTypes.number.isRequired,
  auto: PropTypes.bool.isRequired,
};

export default Start1Text;
