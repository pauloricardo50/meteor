import React, { Component, PropTypes } from 'react';

import { toMoney, toNumber } from '/imports/js/finance-math.js';


export default class Line11a extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <article onClick={this.props.setStep}>
        {/* <h1 className={this.props.classes.text}>
          En développement: Ici il y aura de gros graphiques avec un recapitulatif.
        </h1> */}
        <div className="mask1 col-xs-6 text-center">
          <span className="fa fa-home fa-2x" />
          <br />
          <h1>{this.props.propertyValue}</h1>
        </div>
        <div className="mask1 col-xs-6"></div>
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
};
