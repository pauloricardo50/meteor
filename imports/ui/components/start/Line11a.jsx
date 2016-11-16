import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

import { toMoney, toNumber } from '/imports/js/finance-math.js';


export default class Line11a extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <article onClick={this.props.setStep}>
        <h1 className={this.props.classes.text}>
          En développement: Ici il y aura de gros graphiques avec un recapitulatif.
        </h1>
      </article>
    );
  }
}

Line11a.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  step: PropTypes.number.isRequired,
  twoBuyers: PropTypes.bool.isRequired,
  setStep: PropTypes.func.isRequired,
  completeStep: PropTypes.func.isRequired,
};
