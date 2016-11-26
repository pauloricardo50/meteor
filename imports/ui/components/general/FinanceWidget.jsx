import React, { PropTypes } from 'react';
import { updateValues } from '/imports/api/creditrequests/methods.js';

import Slider from 'material-ui/Slider';

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
    this.propertyValue = this.props.creditRequest.propertyInfo.value;
    this.fortune = this.props.creditRequest.financialInfo.fortune +
      this.props.creditRequest.financialInfo.insuranceFortune;

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
    const newPropertyValue = nextProps.creditRequest.propertyInfo.value
    const newFortune = nextProps.creditRequest.financialInfo.fortune +
      nextProps.creditRequest.financialInfo.insuranceFortune;
    // Only update if the value is new
    if (newPropertyValue && newFortune) {
      if ((newPropertyValue !== this.state.propertyValue) || (newFortune !== this.fortune)) {
        this.setState({
          propertyValue: newPropertyValue,
          sliderValue: newPropertyValue - newFortune,
        });
      }
    }
  }


  onDragStop() {
    const object = {};
    const id = this.props.creditRequest._id;
    // Only change fortune when changing the slider, let insuranceFortune the same
    object['financialInfo.fortune'] = Number(
      this.state.propertyValue -
      this.state.sliderValue -
      this.props.creditRequest.financialInfo.insuranceFortune
    );

    updateValues.call({ object, id });
  }


  setSlider(event, value) {
    this.setState({ sliderValue: value });
  }


  toMoney(value) {
    return String(value).replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  }


  render() {
    // If property value and fortune hasn't been specified, don't show anything
    if (!this.state.propertyValue || !this.state.sliderValue) {
      return null;
    }
    return (
      <article className="animated fadeIn mask1 finance-widget">
        <h3>CHF {this.toMoney(this.state.propertyValue * 1.05)}</h3>
        <hr />
        <h5 className="secondary" style={styles.smallH_1}>Propriété</h5>
        <h5 className="secondary" style={styles.smallH_2}>CHF {this.toMoney(this.state.propertyValue)}</h5>
        <br />
        <h5 className="secondary" style={styles.smallH_1}>Notaire ~5%</h5>
        <h5 className="secondary" style={styles.smallH_2}>CHF {this.toMoney(this.state.propertyValue * 0.05)}</h5>

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
            <p>CHF {this.toMoney(this.state.propertyValue - this.state.sliderValue)}</p>
            <h4>Prêt</h4>
            <p>CHF {this.toMoney(this.state.sliderValue)}</p>
          </div>
        </div>
      </article>
    );
  }
}

FinanceWidget.propTypes = {
  creditRequest: PropTypes.objectOf(PropTypes.any),
};
