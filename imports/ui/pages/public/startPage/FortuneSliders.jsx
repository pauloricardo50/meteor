import PropTypes from 'prop-types';
import React from 'react';

import RaisedButton from 'material-ui/RaisedButton';

import { toMoney } from '/imports/js/helpers/conversionFunctions';
import { getProject } from '/imports/js/helpers/startFunctions';
import constants from '/imports/js/config/constants';
import { T, IntlNumber } from '/imports/ui/components/general/Translation.jsx';

import StartSlider from './StartSlider.jsx';

const styles = {
  sliders: {
    margin: 0,
  },
  h2: {
    marginBottom: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: 'initial',
    margin: 0,
  },
};

// Make sure the value never exceeds the sliders' max or min
const valueInRange = (value, min, max) => {
  if (value >= min && value <= max) {
    return value;
  } else if (value < min) {
    return min;
  } else if (value > max) {
    return max;
  }

  return value;
};

const getFortuneNeeded = (fortuneUsed, insuranceFortuneUsed, formState) => {
  // Make sure we're properly calculating the fortune needed, which should
  // include any new insuranceFortuneUsed and the taxes that it adds to the project value
  return (
    getProject({
      ...formState,
      insuranceFortuneUsed,
      fortuneUsed: fortuneUsed || formState.fortuneUsed,
    }) - formState.loanWanted
  );
};

const handleChangeFortune = (props, e, fortuneUsed) => {
  const object = formState => ({
    insuranceFortuneUsed: valueInRange(
      (getFortuneNeeded(fortuneUsed, 0, formState) - fortuneUsed) / (1 - constants.lppFees),
      props.sliders[1].sliderMin,
      props.sliders[1].sliderMax,
    ),
    fortuneUsed,
  });

  props.setFormState(false, false, false, object);
};

const handleChangeInsurance = (props, e, insuranceFortuneUsed) => {
  const object = formState => ({
    fortuneUsed: valueInRange(
      getFortuneNeeded(0, insuranceFortuneUsed, formState) - insuranceFortuneUsed,
      props.sliders[0].sliderMin,
      props.sliders[0].sliderMax,
    ),
    insuranceFortuneUsed,
  });

  props.setFormState(false, false, false, object);
};

const FortuneSliders = props => {
  const hasToUseLpp = props.formState.fortune < props.formState.minFortune;
  return (
    <div className="fortune-sliders" key={props.index}>

      <h1 className="fixed-size">
        {props.text1}
      </h1>

      <h2 className="fixed-size" style={styles.h2}>
        <label htmlFor="" style={styles.label}><T id="Start2Form.fortuneSliders.label1" /></label>
        <span className="active">
          CHF
          {' '}
          {toMoney(props.formState.fortuneUsed || props.sliders[0].sliderMax)}
        </span>
      </h2>
      <StartSlider
        {...props}
        {...props.sliders[0]}
        setFormState={(e, value) => handleChangeFortune(props, e, value)}
        style={styles.sliders}
        initialValue={props.sliders[0].sliderMax}
      />

      {props.formState.useInsurance &&
        <div className="animated fadeIn" style={{ position: 'relative' }}>
          <h2 className="fixed-size" style={styles.h2}>
            <label htmlFor="" style={styles.label}>
              <T id="Start2Form.fortuneSliders.label2" />
            </label>
            <span className="active">
              CHF {toMoney(props.formState.insuranceFortuneUsed || 0)}
            </span>
          </h2>
          <StartSlider
            {...props}
            {...props.sliders[1]}
            setFormState={(e, value) => handleChangeInsurance(props, e, value)}
            style={styles.sliders}
          />
        </div>}
      {!props.formState.useInsurance &&
        <div className="text-center animated fadeIn">
          <h2 className="fixed-size">
            {hasToUseLpp && <T id="Start2Form.fortuneSliders.hasToUseLpp" />}
            {!hasToUseLpp && <T id="Start2Form.fortuneSliders.notHasToUseLpp" />}
          </h2>
          <RaisedButton
            label={<T id="Start2Form.fortuneSliders.use" />}
            style={{ marginRight: 8 }}
            onTouchTap={() => props.setFormState('useInsurance', true)}
            primary
          />
          <RaisedButton label={<T id="Start2Form.whyButton" />} />
        </div>}
    </div>
  );
};

FortuneSliders.propTypes = {
  formState: PropTypes.objectOf(PropTypes.any).isRequired,
  setFormState: PropTypes.func.isRequired,
  sliders: PropTypes.arrayOf(PropTypes.object).isRequired,
  text1: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  index: PropTypes.number.isRequired,
};

export default FortuneSliders;
