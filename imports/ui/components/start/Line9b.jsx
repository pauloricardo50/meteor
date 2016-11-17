import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

import { toMoney, toNumber } from '/imports/js/finance-math.js';


export default class Line9b extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <article onClick={this.props.setStep}>
        <h1 className={this.props.classes.text}>
          Vous pouvez emprunter au maximum CHF 400'000 et donc acheter une propriété de CHF 500'000.
        </h1>
      </article>
    );
  }
}

Line9b.propTypes = {
  step: PropTypes.number.isRequired,
  setStep: PropTypes.func.isRequired,
  setStateValue: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
};
