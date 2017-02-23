import React, { Component, PropTypes } from 'react';


import { toMoney } from '/imports/js/conversionFunctions';
import { getMonthlyPayment } from '/imports/js/finance-math';
import { getLoanValue } from '/imports/js/requestFunctions';

const styles = {
  main: {
    position: 'absolute',
    bottom: 0,
    margin: 20,
    width: 'calc(100% - 40px)',
    textDecoration: 'none',
    color: 'unset',
  },
  title: {
    display: 'block',
    width: '100%',
    textAlign: 'left',
    margin: 0,
    paddingTop: 8,
  },
  value: {
    display: 'block',
    width: '100%',
    textAlign: 'right',
    marginTop: 8,
    paddingBottom: 8,
  },
};

export default class SideNavFinance extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <a className="mask1 text-center hover-rise" style={styles.main} href="/finance">
        <h4 className="secondary" style={styles.title}>Votre emprunt</h4>
        <h3 style={styles.value} className="fixed-size">
          CHF {toMoney(Math.round(getLoanValue(this.props.loanRequest)))}
        </h3>
        <h4 className="secondary" style={styles.title}>Coût estimé</h4>
        <h3 style={styles.value} className="fixed-size">
          CHF ~{toMoney(Math.round(getMonthlyPayment(this.props.loanRequest)[0]))}
          <small>/mois</small>
        </h3>
      </a>
    );
  }
}

SideNavFinance.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any),
};
