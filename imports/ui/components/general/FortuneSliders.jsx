import React, {PropTypes} from 'react';

import Slider from 'material-ui/Slider';

import { toMoney } from '/imports/js/finance-math';

const styles = {
  section: {
    marginTop: 40,
  },
  mainSlider: {
    width: '80%',
  },
  sliderStyle: {
    // height: 20,
    // color: '#50E3C2',
    // backgroundColor: '#50E3C2',
  },
};

export default class FortuneSliders extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value1: 1,
      value2: 0,
      propertyValue: 1000000
    };

    this.handleChange1 = this.handleChange1.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.getWidth = this.getWidth.bind(this);
  }

  handleChange1(event, value) {
    this.setState({ value1: value });
  }
  handleChange2(event, value) {
    this.setState({ value2: value });
  }

  getWidth() {
    const value = this.state.value1;
    let baseWidth = 20;

    baseWidth += (1 - value) * 80;

    return baseWidth;
  }

  render() {
    const cash = this.state.propertyValue * (1 - (this.state.value1 * 0.8));

    return (
      <section className="col-xs-12 col-sm-8 col-sm-offset-2 mask1" style={styles.section}>
        <h1>Propriété de CHF {toMoney(this.state.propertyValue)}</h1>
        <div className="property-value">
          <div className="loan" style={{ width: `${this.state.value1 * 80}%` }} />

          <div className="insurance" style={{ width: `${
            (this.state.value1 * 80) + ((1 - (this.state.value1 * 0.8)) * this.state.value2 * 100)
          }%` }} />

          <div className="vertical-line" />

          <div style={styles.mainSlider} className="slider1">
            <Slider
              min={0}
              max={1}
              step={0.01}
              defaultValue={1}
              onChange={this.handleChange1}
              ref={(c) => { this.slider1 = c; }}
            />
          </div>

          <div className="slider2" style={{ width: `${this.getWidth()}%` }}>
            <Slider
              min={0}
              max={1}
              onChange={this.handleChange2}
              ref={(c) => { this.slider2 = c; }}
              sliderStyle={styles.sliderStyle}
            />
          </div>
        </div>
        <div className="col-xs-12 values">
          <p>Emprunt</p>
          <h2>CHF {toMoney(Math.round(this.state.value1 * this.state.propertyValue * 0.8))}</h2>
          <p>Cash</p>
          <h2>CHF {toMoney(Math.round(cash * (1 - this.state.value2)))}</h2>
          <p>2ème pilier</p>
          <h2>CHF {toMoney(Math.round(cash * this.state.value2))}</h2>
          <p>Prêteurs</p>
          <h2>{this.state.value1 > 0.7 / 0.8 ? '10' : '20'}</h2>
        </div>
      </section>
    );
  }
}

FortuneSliders.propTypes = {
};
