import React, { PropTypes } from 'react';

import Slider from 'material-ui/Slider';

const styles = {
  mask: {
    position: 'relative',
    height: '95%',
    top: 50,
    width: 200,
    bottom: 25,
    left: 25,
  },
  smallH_1: {
    display: 'inline-block',
    float: 'left',
    marginTop: 0,
    // width: '40%',
  },
  smallH_2: {
    display: 'inline-block',
    float: 'right',
    marginTop: 0,
    // width: '40%',
  },
  slider: {
    position: 'absolute',
    bottom: 44,
    left: 20,
    height: '60%',
  },
  sliderValues: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
};


export default class FinanceWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sliderValue: 800000,
    };

    this.setSlider = this.setSlider.bind(this);
  }

  setSlider(event, value) {
    this.setState({ sliderValue: value });
  }

  render() {
    return (
      <article className="mask1 finance-widget" style={styles.mask}>
        <h3>CHF 1'209'600</h3>
        <hr />
        <h5 className="secondary" style={styles.smallH_1}>Propriété</h5>
        <h5 className="secondary" style={styles.smallH_2}>CHF 1'152'000</h5>
        <br />
        <h5 className="secondary" style={styles.smallH_1}>Notaire ~5%</h5>
        <h5 className="secondary" style={styles.smallH_2}>CHF 57'600</h5>

        <Slider
          style={styles.slider}
          axis="y"
          min={0}
          max={1209600}
          step={10000}
          value={this.state.sliderValue}
          onChange={this.setSlider}
        />

        <div style={styles.sliderValues}>
          <h4>Cash</h4>
          <p>{1209600 - this.state.sliderValue}</p>
          <h4>Prêt</h4>
          <p>{this.state.sliderValue}</p>
        </div>

      </article>
    );
  }
}

FinanceWidget.propTypes = {
};
