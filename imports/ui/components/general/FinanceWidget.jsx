import React, { PropTypes } from 'react';
import cleanMethod from '/imports/api/cleanMethods';

import Slider from 'material-ui/Slider';

import { toMoney } from '/imports/js/conversionFunctions';

const styles = {
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
    position: 'relative',
    height: '100%',
  },
  sliderValues: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    textAlign: 'right',
  },
};

export default class FinanceWidget extends React.Component {
  constructor(props) {
    super(props);
    this.propertyValue = this.props.loanRequest.property.value;
    this.fortune = this.props.loanRequest.general.fortuneUsed +
      this.props.loanRequest.general.insuranceFortuneUsed;

    this.state = {
      propertyValue: '',
      sliderValue: '',
    };
    if (this.propertyValue && this.fortune) {
      this.state = {
        propertyValue: this.propertyValue,
        sliderValue: this.propertyValue - this.fortune,
      };
    }

    this.setSlider = this.setSlider.bind(this);
    this.onDragStop = this.onDragStop.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const newPropertyValue = nextProps.loanRequest.property.value;
    const newFortune = nextProps.loanRequest.general.fortuneUsed +
      nextProps.loanRequest.general.insuranceFortuneUsed;
    // Only update if the value is new
    if (newPropertyValue && newFortune) {
      if (
        newPropertyValue !== this.state.propertyValue ||
        newFortune !== this.fortune
      ) {
        this.setState({
          propertyValue: newPropertyValue,
          sliderValue: newPropertyValue - newFortune,
        });
      }
    }
  }

  onDragStop() {
    const object = {};
    const id = this.props.loanRequest._id;
    // Only change fortune when changing the slider, let insuranceFortune the same
    object['general.fortuneUsed'] = Number(
      this.state.propertyValue -
        this.state.sliderValue -
        this.props.loanRequest.general.insuranceFortuneUsed,
    );

    cleanMethod('update', id, object);
  }

  setSlider(event, value) {
    this.setState({ sliderValue: value });
  }

  render() {
    // If property value and fortune hasn't been specified, don't show anything
    if (!this.state.propertyValue || !this.state.sliderValue) {
      return null;
    }
    return (
      <article className="animated fadeIn mask1 finance-widget">
        <h3>CHF {toMoney(this.state.propertyValue * 1.05)}</h3>
        <hr />
        <h5 className="secondary" style={styles.smallH_1}>Propriété</h5>
        <h5 className="secondary" style={styles.smallH_2}>
          CHF {toMoney(this.state.propertyValue)}
        </h5>
        <br />
        <h5 className="secondary" style={styles.smallH_1}>Notaire ~5%</h5>
        <h5 className="secondary" style={styles.smallH_2}>
          CHF {toMoney(this.state.propertyValue * 0.05)}
        </h5>

        <div className="slider-div">
          <Slider
            style={styles.slider}
            // className="slider"
            axis="y"
            min={0}
            max={this.state.propertyValue}
            step={10000}
            value={this.state.sliderValue}
            onChange={this.setSlider}
            onDragStop={this.onDragStop}
          />

          <div style={styles.sliderValues}>
            <h4>Fonds Propres</h4>
            <p>
              CHF {toMoney(this.state.propertyValue - this.state.sliderValue)}
            </p>
            <h4>Prêt</h4>
            <p>CHF {toMoney(this.state.sliderValue)}</p>
          </div>
        </div>
      </article>
    );
  }
}

FinanceWidget.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any),
};
