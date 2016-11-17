import React, { Component, PropTypes } from 'react';
import CountUp from 'react-countup';

import RaisedButton from 'material-ui/RaisedButton';

import { toMoney, toNumber } from '/imports/js/finance-math.js';


export default class Line11a extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <article onClick={this.props.setStep} className="col-xs-12">
        {/* <h1 className={this.props.classes.text}>
          En développement: Ici il y aura de gros graphiques avec un recapitulatif.
        </h1> */}
        <div className="mask1">
          <div className="col-xs-6 text-center">
            <span className="fa fa-home fa-2x" />
            <br />
            <h1><CountUp
              className="custom-count"
              start={0}
              end={
                Number(this.props.propertyValue) -
                Number(this.props.fortune) -
                Number(this.props.insuranceFortune)
              }
              duration={3}
              useEasing
              separator=" "
              decimal="."
              prefix="Empruntez CHF "
              suffix=""
            /></h1>
          </div>
          <div className="col-xs-6">

          </div>
          <br />
          <RaisedButton label="Continuer" primary />
        </div>
      </article>
    );
  }
}

Line11a.propTypes = {
  step: PropTypes.number.isRequired,
  setStep: PropTypes.func.isRequired,
  setStateValue: PropTypes.func.isRequired,
  completeStep: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.string).isRequired,

  propertyValue: PropTypes.string.isRequired,
  fortune: PropTypes.string.isRequired,
  insuranceFortune: PropTypes.string.isRequired,
  isValid: PropTypes.bool.isRequired,
};
