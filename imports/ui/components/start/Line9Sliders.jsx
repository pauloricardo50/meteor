import React, { Component, PropTypes } from 'react';

import TextField from 'material-ui/TextField';
import Slider from 'material-ui/Slider';

import { toMoney, toNumber } from '/imports/js/finance-math.js';


const styles = {
  h1: {
    verticalAlign: 'top',
    display: 'inline-block',
  },
  TextField: {
    fontSize: 'inherit',
    width: '100%',
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

export default class Line9Sliders extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lotsOfCash: false, // Allow rich users to slide higher than the default max values
      lotsOfInsurance: false,
    };

    this.changeFortune = this.changeFortune.bind(this);
    this.changeInsuranceFortune = this.changeInsuranceFortune.bind(this);
    this.sliderChangeFortune = this.sliderChangeFortune.bind(this);
    this.sliderChangeInsuranceFortune = this.sliderChangeInsuranceFortune.bind(this);
  }

  changeFortune(event, value) {
    const isPercent = false;
    const isSlider = false;
    this.props.changeFortune(toNumber(value), isPercent, isSlider);
  }

  changeInsuranceFortune(event, value) {
    const isPercent = false;
    const isSlider = false;
    this.props.changeInsuranceFortune(toNumber(value), isPercent, isSlider);
  }

  sliderChangeFortune(event, value) {
    const isPercent = true;
    const isSlider = true;
    this.props.changeFortune(value, isPercent, isSlider);
  }

  sliderChangeInsuranceFortune(event, value) {
    const isPercent = true;
    const isSlider = true;
    this.props.changeInsuranceFortune(value, isPercent, isSlider);
  }


  render() {
    return (
      <span>

        <div className="col-xs-12">
          <h1 style={styles.h1} className="col-sm-4 col-xs-12">
            <TextField
              name="fortune"
              floatingLabelText="Fortune"
              value={`CHF ${toMoney(this.props.fortune)}`}
              style={styles.TextField}
              onChange={this.changeFortune}
            />
          </h1>
          <span style={styles.sliderSpan} className="col-sm-8 col-xs-12">
            <Slider
              value={this.props.fortune / this.props.propertyValue > 0.1 ?
                this.props.fortune / this.props.propertyValue
                : 0.1
              }
              onChange={this.sliderChangeFortune}
              min={0}
              max={this.state.lotsOfCash ? 0.5 : 0.3}
              step={0.01}
              onDragStop={() => ''}
            />
            <h4 className="secondary" style={styles.label1}>0%</h4>
            <h4 className="secondary" style={styles.label2}>{this.state.lotsOfCash ? '50%' : '30%'}</h4>
          </span>
        </div>

        <div className="col-xs-12">
          <h1 style={styles.h1} className="col-sm-4 col-xs-12">
            <TextField
              name="insuranceFortune"
              floatingLabelText="2ème Pilier"
              value={`CHF ${toMoney(this.props.insuranceFortune)}`}
              style={styles.TextField}
              onChange={this.changeInsuranceFortune}
            />
          </h1>
          <span style={styles.sliderSpan} className="col-sm-8 col-xs-12">
            <Slider
              value={this.props.insuranceFortune / this.props.propertyValue}
              onChange={this.sliderChangeInsuranceFortune}
              min={0}
              max={this.state.lotsOfInsurance ? 0.5 : 0.2}
              step={0.01}
            />
            <h4 className="secondary" style={styles.label1}>0%</h4>
            <h4 className="secondary" style={styles.label2}>{this.state.lotsOfCash ? '50%' : '20%'}</h4>
          </span>
        </div>
      </span>
    );
  }
}

Line9Sliders.propTypes = {
  fortune: PropTypes.number.isRequired,
  insuranceFortune: PropTypes.number.isRequired,
  propertyValue: PropTypes.number.isRequired,
  changeFortune: PropTypes.func.isRequired,
  changeInsuranceFortune: PropTypes.func.isRequired,
};
