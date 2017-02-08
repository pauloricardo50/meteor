import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

import RaisedButton from 'material-ui/RaisedButton';

import { minimumFortuneRequired } from '/imports/js/finance-math';

import Sliders from './Sliders.jsx';


var timer;

const styles = {
  article: {
    height: 'unset',
    lineHeight: 'unset',
  },
};

export default class SliderLine extends Component {
  constructor(props) {
    super(props);

    const minFortune = minimumFortuneRequired(
      Number(this.props.age1),
      Number(this.props.age2),
      this.props.gender1,
      this.props.gender2,
      this.props.propertyType,
      Number(this.props.salary) + Number(this.props.bonus),
      Number(this.props.propertyValue),
    )[0];

    if (this.props.propertyValue !== 0) {
      this.state = {
        minFortunePercent: Math.ceil(100 * (minFortune / this.props.propertyValue)) / 100,
      };
    } else {
      // default fallback if the property value is zero
      this.state = {
        minFortunePercent: 0.2,
      };
    }
  }


  componentDidMount(props) {
    // Set the initial fortune values based on the choice in line 8, sum of both has to be minFortune
    this.initialize(this.props, this.state);
  }

  initialize(props, state) {
    if (props.maxCash) {
      props.setStateValue('fortune', String(Math.round(props.propertyValue * state.minFortunePercent)));
      props.setStateValue('insuranceFortune', '0');
    } else {
      props.setStateValue('fortune', String(Math.round(props.propertyValue * 0.1)));
      props.setStateValue('insuranceFortune', String(Math.round(props.propertyValue * (state.minFortunePercent - 0.1))));
    }
  }


  componentWillReceiveProps(nextProps, nextState) {
    const p = this.props;
    const n = nextProps;

    if (p.maxCash !== n.maxCash) {
      if (n.maxCash) {
        p.setStateValue('fortune', String(Math.round(n.propertyValue * 0.2)));
        p.setStateValue('insuranceFortune', '0');
      } else {
        p.setStateValue('fortune', String(Math.round(n.propertyValue * 0.1)));
        p.setStateValue('insuranceFortune', String(Math.round(n.propertyValue * 0.1)));
      }
    }

    // Make sure we don't calculate this if it's not an update
    if (
      p.age1 !== n.age1 ||
      p.age2 !== n.age2 ||
      p.gender1 !== n.gender1 ||
      p.propertyType !== n.propertyType ||
      p.salary !== n.salary ||
      p.bonus !== n.bonus ||
      p.propertyValue !== n.propertyValue
    ) {
      const minFortune = minimumFortuneRequired(
        Number(n.age1),
        Number(n.age2),
        n.gender1,
        n.gender2,
        n.propertyType,
        Number(n.salary) + Number(n.bonus),
        Number(n.propertyValue),
      )[0];

      if (n.propertyValue !== 0 && minFortune) {
        this.setState({
          minFortunePercent: Math.ceil(100 * (minFortune / n.propertyValue)) / 100,
        },
          this.initialize(nextProps, this.state),
        );
      } else {
        this.initialize(nextProps, this.state);
      }
    }
  }


  shouldComponentUpdate(n, nextState) {
    const p = this.props;

    return true;
    // return (
    //   p.classes !== n.classes ||
    //   p.twoBuyers !== n.twoBuyers ||
    //   p.maxCash !== n.maxCash ||
    //   p.maxDebt !== n.maxDebt ||
    //   p.propertyValue !== n.propertyValue ||
    //   p.fortune !== n.fortune ||
    //   p.insuranceFortune !== n.insuranceFortune ||
    //   p.propertyType !== n.propertyType
    // );
  }


  changeFortune(value, isSlider) {
    const newFortune = (isSlider ? Math.round(value * this.props.propertyValue) : value);

    if (isSlider && newFortune < 0.1 * this.props.propertyValue) {
      // If it is a slider, and the newFortune is below 10%, do not even update
      return;
    }

    this.props.setStateValue(
      'fortune',
      String(newFortune),
      () => this.adjustValues(true, isSlider)
    );
  }

  changeInsuranceFortune(value, isSlider) {
    this.props.setStateValue(
      'insuranceFortune',
      String(isSlider ? Math.round(value * this.props.propertyValue) : value),
      () => this.adjustValues(false, isSlider)
    );
  }

  adjustValues(isFortune, isSlider) {
    if (isSlider) {
      this.adjustValuesFunc(isFortune);
    } else {
      Meteor.clearTimeout(timer);

      // If this isn't a slider, wait for 2 seconds before auto adjusting the other value
      timer = Meteor.setTimeout(() => {
        this.adjustValuesFunc(isFortune);
      }, 2000);
    }
  }

  adjustValuesFunc(isFortune) {
    const f = this.props.fortune;
    const i = this.props.insuranceFortune;
    const p = this.props.propertyValue;

    const minFortune = this.state.minFortunePercent;

    // Make sure fortune is always at least 10%, and set insurance to the rest
    if (f < 0.1 * p) {
      this.props.setStateValue('fortune', String(Math.round(0.1 * p)));
      this.props.setStateValue('insuranceFortune', String(Math.round((minFortune - 0.1) * p)));
    } else if (f + i < minFortune * p) {
      // If both fortunes combined aren't at least what's required
      // Set the other value to be the rest
      if (isFortune) {
        this.props.setStateValue('insuranceFortune', String(Math.round((minFortune * p) - f)));
      } else {
        this.props.setStateValue('fortune', String(Math.round((minFortune * p) - i)));
      }
    } else if (this.props.maxDebt) {
      // If the user wants maximum Debt, always keep both combined at the minimum
      if (isFortune) {
        this.props.setStateValue('insuranceFortune', String(Math.round((minFortune * p) - f)));
      } else {
        this.props.setStateValue('fortune', String(Math.round((minFortune * p) - i)));
      }
    }
  }

  render() {
    return (
      <article onClick={this.props.setStep} className={this.props.classes.text} style={styles.article}>
        <Sliders
          twoBuyers={this.props.twoBuyers}
          fortune={this.props.fortune}
          insuranceFortune={this.props.insuranceFortune}
          maxDebt={this.props.maxDebt}
          propertyValue={this.props.propertyValue}
          propertyType={this.props.propertyType}
          minFortunePercent={this.state.minFortunePercent}
          changeFortune={(value, isSlider) => this.changeFortune(value, isSlider)}
          changeInsuranceFortune={(value, isSlider) => this.changeInsuranceFortune(value, isSlider)}
        />
        {this.props.step === this.props.index &&
          <div className="text-center col-xs-12">
            <RaisedButton
              label="Je suis satisfait"
              onClick={e => this.props.completeStep(e, true, true)}
              primary
            />
          </div>
        }
      </article>
    );
  }
}

SliderLine.propTypes = {
  step: PropTypes.number.isRequired,
  setStep: PropTypes.func.isRequired,
  setStateValue: PropTypes.func.isRequired,
  completeStep: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  index: PropTypes.number.isRequired,

  twoBuyers: PropTypes.bool.isRequired,
  maxCash: PropTypes.bool.isRequired,
  maxDebt: PropTypes.bool.isRequired,
  propertyValue: PropTypes.string.isRequired,
  fortune: PropTypes.string.isRequired,
  insuranceFortune: PropTypes.string.isRequired,
  propertyType: PropTypes.string.isRequired,

  age1: PropTypes.string.isRequired,
  age2: PropTypes.string.isRequired,
  gender1: PropTypes.string.isRequired,
  gender2: PropTypes.string.isRequired,
  salary: PropTypes.string.isRequired,
  bonus: PropTypes.string.isRequired,
};
