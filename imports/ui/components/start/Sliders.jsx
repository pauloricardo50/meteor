import React, { Component, PropTypes } from 'react';

import TextField from 'material-ui/TextField';
import Slider from 'material-ui/Slider';
import MaskedInput from 'react-text-mask';

import { toMoney, toNumber } from '/imports/js/finance-math.js';
import { swissFrancMask } from '/imports/js/textMasks.js';


const styles = {
  span: {
    display: 'inline-block',
    width: '100%',
  },
  h1: {
    verticalAlign: 'top',
    display: 'inline-block',
    marginBottom: 0,
  },
  TextField: {
    fontSize: 'inherit',
    width: 160,
  },
  sliderSpan: {
    position: 'relative',
  },
  label1: {
    position: 'absolute',
    top: 32,
    left: -4,
  },
  label2: {
    position: 'absolute',
    top: 32,
    right: -8,
  },
};

export default class Sliders extends Component {
  constructor(props) {
    super(props);

    this.changeFortune = this.changeFortune.bind(this);
    this.changeInsuranceFortune = this.changeInsuranceFortune.bind(this);
    this.sliderChangeFortune = this.sliderChangeFortune.bind(this);
    this.sliderChangeInsuranceFortune = this.sliderChangeInsuranceFortune.bind(this);
    this.getMaxFortuneSlider = this.getMaxFortuneSlider.bind(this);
    this.getMaxInsuranceSlider = this.getMaxInsuranceSlider.bind(this);
  }


  shouldComponentUpdate(nextProps, nextState) {
    const p = this.props;
    const n = nextProps;

    return true;
  }

  changeFortune(event, value) {
    const isSlider = false;
    this.props.changeFortune(String(toNumber(value)), isSlider);
  }

  changeInsuranceFortune(event, value) {
    const isSlider = false;
    this.props.changeInsuranceFortune(String(toNumber(value)), isSlider);
  }

  sliderChangeFortune(event, value) {
    const isSlider = true;
    this.props.changeFortune(value, isSlider);
  }

  sliderChangeInsuranceFortune(event, value) {
    const isSlider = true;
    this.props.changeInsuranceFortune(value, isSlider);
  }

  getMaxFortuneSlider() {
    // It should at least go until the minimum amount required
    let max = this.props.minFortunePercent;

    if (!this.props.maxDebt) {
      // Add 20% of padding if the customer wants to go in less debt
      max += 0.2;
      // Return nice rounded value
      return Math.ceil(max * 10) / 10;
    }

    return max;
  }

  getMaxInsuranceSlider() {
    // You need at least 10% of cash, so substract that
    let max = this.props.minFortunePercent - 0.1;

    if (!this.props.maxDebt) {
      max += 0.2;
      // Return nice rounded value
      return Math.ceil(max * 10) / 10;
    }

    return max;
  }


  render() {
    return (
      <span style={styles.span}>
        <h1 className="col-xs-12">
          {this.props.twoBuyers ?
            'Nos fonds propres seront répartis ainsi:' :
            'Mes fonds propres seront répartis ainsi:'
          }
        </h1>
        <div className="col-sm-12">
          <h1 style={styles.h1} className="col-sm-4 col-xs-12">
            <TextField
              style={styles.TextField}
              name="fortune"
              floatingLabelText="Fortune"
              onChange={this.changeFortune}
            >
              <MaskedInput
                value={this.props.fortune}
                mask={swissFrancMask}
                guide
                pattern="[0-9]*"
              />
            </TextField>
          </h1>
          <span style={styles.sliderSpan} className="col-sm-8 col-xs-12">
            <Slider
              value={toNumber(this.props.fortune) / toNumber(this.props.propertyValue)}
              onChange={this.sliderChangeFortune}
              min={0}
              max={this.getMaxFortuneSlider()}
              step={0.005}
              ref={(c) => { this.slider1 = c; }}
            />
            <h4 className="secondary" style={styles.label1}>0%</h4>
            <h4 className="secondary" style={styles.label2}>{Math.round(100 * this.getMaxFortuneSlider())}%</h4>
          </span>
        </div>

        {this.props.propertyType === 'primary' &&
          <div className="col-sm-12">
            <h1 style={styles.h1} className="col-sm-4 col-xs-12">
              <TextField
                style={styles.TextField}
                name="insuranceFortune"
                floatingLabelText="2ème Pilier"
                onChange={this.changeInsuranceFortune}
              >
                <MaskedInput
                  value={this.props.insuranceFortune}
                  mask={swissFrancMask}
                  guide
                  pattern="[0-9]*"
                />
              </TextField>
            </h1>
            <span style={styles.sliderSpan} className="col-sm-8 col-xs-12">
              <Slider
                value={toNumber(this.props.insuranceFortune) / toNumber(this.props.propertyValue)}
                onChange={this.sliderChangeInsuranceFortune}
                min={0}
                max={this.getMaxInsuranceSlider()}
                step={0.005}
              />
              <h4 className="secondary" style={styles.label1}>0%</h4>
              <h4 className="secondary" style={styles.label2}>{Math.round(100 * this.getMaxInsuranceSlider())}%</h4>
            </span>
          </div>
        }
      </span>
    );
  }
}

Sliders.propTypes = {
  twoBuyers: PropTypes.bool.isRequired,
  fortune: PropTypes.string.isRequired,
  insuranceFortune: PropTypes.string.isRequired,
  propertyValue: PropTypes.string.isRequired,
  maxDebt: PropTypes.bool.isRequired,
  changeFortune: PropTypes.func.isRequired,
  changeInsuranceFortune: PropTypes.func.isRequired,
  propertyType: PropTypes.string.isRequired,

  minFortunePercent: PropTypes.number.isRequired,
};
