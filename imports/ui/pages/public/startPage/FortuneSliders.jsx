import PropTypes from 'prop-types';
import React from 'react';

import RaisedButton from 'material-ui/RaisedButton';

import { toMoney } from '/imports/js/helpers/conversionFunctions';
import { getProject } from '/imports/js/helpers/startFunctions';

import StartSlider from './StartSlider.jsx';

const styles = {
  sliders: {
    margin: 0,
  },
  h2: {
    marginBottom: 0,
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

export default class FortuneSliders extends React.Component {
  getFortuneNeeded(insuranceFortuneUsed) {
    // Make sure we're properly calculating the fortune needed, which should
    // include any new insuranceFortuneUsed and the taxes that it adds to the project value
    if (insuranceFortuneUsed) {
      return getProject({ ...this.props.formState, insuranceFortuneUsed }) -
        this.props.formState.loanWanted;
    }
    return getProject(this.props.formState) - this.props.formState.loanWanted;
  }

  handleChangeFortune = (e, fortuneUsed) => {
    const object = {
      insuranceFortuneUsed: valueInRange(
        this.getFortuneNeeded() - fortuneUsed,
        this.props.sliders[1].sliderMin,
        this.props.sliders[1].sliderMax,
      ),
      fortuneUsed,
    };

    this.props.setFormState(false, false, false, object);
  };

  handleChangeInsurance = (e, insuranceFortuneUsed) => {
    const object = {
      fortuneUsed: valueInRange(
        this.getFortuneNeeded(insuranceFortuneUsed) - insuranceFortuneUsed,
        this.props.sliders[0].sliderMin,
        this.props.sliders[0].sliderMax,
      ),
      insuranceFortuneUsed,
    };

    this.props.setFormState(false, false, false, object);
  };

  render() {
    const hasToUseLpp = this.props.formState.fortune <
      this.props.formState.minFortune;
    return (
      <div className="fortune-sliders" key={this.props.index}>

        <h1 className="fixed-size">
          {this.props.text1}
        </h1>

        <h2 className="fixed-size" style={styles.h2}>
          Fortune:
          {' '}
          <span className="active">
            CHF
            {' '}
            {toMoney(
              this.props.formState.fortuneUsed ||
                this.props.sliders[0].sliderMin,
            )}
          </span>
        </h2>
        <StartSlider
          {...this.props}
          {...this.props.sliders[0]}
          setFormState={this.handleChangeFortune}
          style={styles.sliders}
        />

        {this.props.formState.useInsurance &&
          <div className="animated fadeIn" style={{ position: 'relative' }}>
            <h2 className="fixed-size" style={styles.h2}>
              2ème Pilier: <span className="active">
                CHF {toMoney(this.props.formState.insuranceFortuneUsed || 0)}
              </span>
            </h2>
            <StartSlider
              {...this.props}
              {...this.props.sliders[1]}
              setFormState={this.handleChangeInsurance}
              style={styles.sliders}
            />
          </div>}
        {!this.props.formState.useInsurance &&
          <div className="text-center animated fadeIn">
            <h2 className="fixed-size">
              {hasToUseLpp &&
                'Vous devez utiliser votre 2ème pilier pour ce projet'}
              {!hasToUseLpp &&
                'Vous êtes éligible pour utiliser votre 2ème pilier'}
            </h2>
            <RaisedButton
              label="Utiliser"
              style={{ marginRight: 8 }}
              onTouchTap={() => this.props.setFormState('useInsurance', true)}
              primary
            />
            <RaisedButton label="Pourquoi?" />
          </div>}
      </div>
    );
  }
}

FortuneSliders.propTypes = {
  formState: PropTypes.objectOf(PropTypes.any).isRequired,
  setFormState: PropTypes.func.isRequired,
  sliders: PropTypes.arrayOf(PropTypes.object).isRequired,
  text1: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  index: PropTypes.number.isRequired,
};
