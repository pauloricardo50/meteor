import React, { Component, PropTypes } from 'react';

import Slider from 'material-ui/Slider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { toMoney } from '/imports/js/conversionFunctions';
import colors from '/imports/js/colors';

const styles = {
  section: {
    display: 'inline-block',
    width: '100%',
  },
  mainSlider: {
    width: '80%',
  },
};

const muiTheme = getMuiTheme({
  slider: {
    // trackColor: colors.secondary,
    selectionColor: colors.secondary,
  },
});

export default class FortuneSliders extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fortune: 1,
      insuranceFortune: 0,
      propertyValue: 1000000,
    };

    this.handleChange1 = this.handleChange1.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.getWidth = this.getWidth.bind(this);
  }

  handleChange1(event, value) {
    this.setState({ fortune: value });
  }
  handleChange2(event, value) {
    this.setState({ insuranceFortune: value });
  }

  getWidth() {
    const value = this.state.fortune;
    let baseWidth = 20;

    baseWidth += (1 - value) * 80;

    return baseWidth - 10;
  }

  render() {
    const cashRatio = 1 - this.state.fortune * 0.8;
    const insuranceRatio = this.state.insuranceFortune
      ? this.state.insuranceFortune * (cashRatio - 0.1)
      : 0;
    const fortuneRatio = cashRatio - insuranceRatio;

    return (
      <section style={styles.section}>
        <h1>Propriété de CHF {toMoney(this.state.propertyValue)}</h1>
        <div className="property-value">
          <h2
            className="loan text-center"
            style={{ width: `${this.state.fortune * 80}%` }}
          >
            CHF 100'000
          </h2>

          <div
            className="insurance"
            style={{
              width: `${this.state.fortune * 80 + (0.9 - this.state.fortune * 0.8) * this.state.insuranceFortune * 100}%`,
            }}
          />

          <div className="vertical-line" />

          <div style={styles.mainSlider} className="slider1">
            <Slider
              min={0}
              max={1}
              step={0.01}
              defaultValue={1}
              onChange={this.handleChange1}
              ref={c => {
                this.slider1 = c;
              }}
            />
          </div>

          <div className="slider2" style={{ width: `${this.getWidth()}%` }}>
            <MuiThemeProvider muiTheme={muiTheme}>
              <Slider
                min={0}
                max={1}
                onChange={this.handleChange2}
                ref={c => {
                  this.slider2 = c;
                }}
                sliderStyle={styles.sliderStyle}
              />
            </MuiThemeProvider>
          </div>
        </div>
        <div className="col-xs-12 values">
          <p>Emprunt</p>
          <h2>
            CHF
            {' '}
            {toMoney(Math.round(this.state.propertyValue * (1 - cashRatio)))}
          </h2>
          <p>Cash</p>
          <h2>
            CHF {toMoney(Math.round(this.state.propertyValue * fortuneRatio))}
          </h2>
          <p>2ème pilier</p>
          <h2>
            CHF {toMoney(Math.round(this.state.propertyValue * insuranceRatio))}
          </h2>
          <p>Prêteurs</p>
          <h2>{this.state.fortune > 0.7 / 0.8 ? '10' : '20'}</h2>
        </div>
      </section>
    );
  }
}

FortuneSliders.propTypes = {};
