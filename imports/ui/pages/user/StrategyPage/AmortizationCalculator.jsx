import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  calculateDirectAmo,
  calculateIndirectAmo,
} from '/imports/js/helpers/logismata/mapping';

import { setToken } from '/imports/js/helpers/logismata/api';

export default class AmortizationCalculator extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.calculate();
  }

  calculate = () => {
    const { loanRequest, borrowers } = this.props;
    setToken(this.props.logismataToken)
      .then(() => calculateDirectAmo(loanRequest, borrowers))
      .then((result) => {
        console.log('result1', result);
        this.setState({ direct: result });
      })
      .then(() => calculateIndirectAmo(loanRequest, borrowers))
      .then((result) => {
        console.log('result2', result);
        this.setState({ indirect: result });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  render() {
    return <div>{JSON.stringify(this.state)}</div>;
  }
}

AmortizationCalculator.propTypes = {
  logismataToken: PropTypes.string.isRequired,
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
};
