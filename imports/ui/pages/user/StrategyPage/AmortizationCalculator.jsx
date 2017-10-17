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
    const { loanRequest, borrowers, offers, logismataToken } = this.props;

    if (!logismataToken) {
      return;
    }

    setToken(logismataToken)
      .then(() => calculateDirectAmo(loanRequest, borrowers, offers))
      .then((result) => {
        console.log('result1', result);
        this.setState({ direct: result });
      })
      .then(() => calculateIndirectAmo(loanRequest, borrowers, offers))
      .then((result) => {
        console.log('result2', result);
        this.setState({ indirect: result });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  render() {
    return (
      <div>
        <pre>{JSON.stringify(this.state, null, 2)}</pre>
      </div>
    );
  }
}

AmortizationCalculator.propTypes = {
  logismataToken: PropTypes.string,
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
  offers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

AmortizationCalculator.defaultProps = {
  logismataToken: undefined,
};
