import React, { Component, PropTypes } from 'react';
import { DocHead } from 'meteor/kadira:dochead';

import FinanceStrategyPicker from '/imports/ui/components/general/FinanceStrategyPicker.jsx';

import PropertyChart from '/imports/ui/components/charts/PropertyChart.jsx';
import ExpensesChart from '/imports/ui/components/charts/ExpensesChart.jsx';

const styles = {
  section: {
    // position: 'relative',
    // width: '100%',
    // paddingRight: 0,
    // paddingLeft: 0,
  },
  h1: {
    // paddingLeft: 20,
  },
};

export default class FinancePage extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    DocHead.setTitle('Mon Financement - e-Potek');
  }

  render() {
    return (
      <section className="mask1 animated fadeIn" style={styles.section}>
        <h1 style={styles.h1}>Finances</h1>

        <h3 className="text-center">Mon Projet</h3>
        <PropertyChart creditRequest={this.props.creditRequest} />
        <h3 className="text-center">Coût Mensuel Estimé</h3>
        <ExpensesChart creditRequest={this.props.creditRequest} />

        {/* <FinanceStrategyPicker creditRequest={this.props.creditRequest} /> */}
      </section>
    );
  }
}

FinancePage.propTypes = {
  creditRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
