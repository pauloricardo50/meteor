import React, { Component, PropTypes } from 'react';
import { DocHead } from 'meteor/kadira:dochead';

import RaisedButton from 'material-ui/RaisedButton';


import PropertyChart from '/imports/ui/components/charts/PropertyChart.jsx';
import ProjectChart from '/imports/ui/components/charts/ProjectChart.jsx';
import ExpensesChart from '/imports/ui/components/charts/ExpensesChart.jsx';

const styles = {
  p: {
    marginBottom: 0,
  },
  article2: {
    overflowY: 'hidden',
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
      <section className="mask1 animated fadeIn">
        <h1>Finances</h1>

        <article>
          <h3 className="text-center">Mon Projet</h3>
          <ProjectChart
            horizontal
            name={this.props.loanRequest.property.address1}
            propertyValue={this.props.loanRequest.property.value}
            fortuneUsed={this.props.loanRequest.general.fortuneUsed}
            insuranceFortuneUsed={this.props.loanRequest.general.insuranceFortuneUsed}
          />
        </article>

        <article style={styles.article2}>
          <h3 className="text-center">Coût Mensuel Estimé*</h3>
          <p className="text-center" style={styles.p}>*Taux d&apos;intérêt fictif de 1.5%</p>
          <ExpensesChart loanRequest={this.props.loanRequest} />
        </article>

      </section>
    );
  }
}

FinancePage.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
