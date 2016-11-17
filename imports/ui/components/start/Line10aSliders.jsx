import React, { Component, PropTypes } from 'react';

import TextField from 'material-ui/TextField';
import Slider from 'material-ui/Slider';

import { toMoney, toNumber } from '/imports/js/finance-math.js';


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

export default class Line10aSliders extends Component {
  constructor(props) {
    super(props);

    this.changeFortune = this.changeFortune.bind(this);
    this.changeInsuranceFortune = this.changeInsuranceFortune.bind(this);
    this.sliderChangeFortune = this.sliderChangeFortune.bind(this);
    this.sliderChangeInsuranceFortune = this.sliderChangeInsuranceFortune.bind(this);

    this.fortuneDragStop = this.fortuneDragStop.bind(this);
  }

  changeFortune(event, value) {
    const isSlider = false;
    this.props.changeFortune(toNumber(value), isSlider);
  }

  changeInsuranceFortune(event, value) {
    const isSlider = false;
    this.props.changeInsuranceFortune(toNumber(value), isSlider);
  }

  sliderChangeFortune(event, value) {
    const isSlider = true;
    this.props.changeFortune(value, isSlider);
  }

  sliderChangeInsuranceFortune(event, value) {
    const isSlider = true;
    this.props.changeInsuranceFortune(value, isSlider);
  }


  fortuneDragStop() {
    this.slider1.value = 0;
  }


  render() {

    return (
      <span style={styles.span}>

        <div className="col-sm-12">
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
              value={this.props.fortune / this.props.propertyValue}
              onChange={this.sliderChangeFortune}
              min={0}
              max={this.props.maxDebt ? 0.2 : 0.4}
              step={0.01}
              ref={(c) => { this.slider1 = c; }}
            />
            <h4 className="secondary" style={styles.label1}>0%</h4>
            <h4 className="secondary" style={styles.label2}>{this.props.maxDebt ? '20%' : '40%'}</h4>
          </span>
        </div>

        <div className="col-sm-12">
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
              max={this.props.maxDebt ? 0.1 : 0.4}
              step={0.01}
            />
            <h4 className="secondary" style={styles.label1}>0%</h4>
            <h4 className="secondary" style={styles.label2}>{this.props.maxDebt ? '10%' : '40%'}</h4>
          </span>
        </div>
      </span>
    );
  }
}

Line10aSliders.propTypes = {
  fortune: PropTypes.number.isRequired,
  insuranceFortune: PropTypes.number.isRequired,
  propertyValue: PropTypes.number.isRequired,
  maxDebt: PropTypes.bool.isRequired,
  changeFortune: PropTypes.func.isRequired,
  changeInsuranceFortune: PropTypes.func.isRequired,
};
