import React, { Component, PropTypes } from 'react';
import { DocHead } from 'meteor/kadira:dochead';

import RaisedButton from 'material-ui/RaisedButton';

import ProjectChart from '/imports/ui/components/charts/ProjectChart.jsx';
import ExpensesChart from '/imports/ui/components/charts/ExpensesChart.jsx';
import FinanceFAQ from '/imports/ui/components/general/FinanceFAQ.jsx';
import Ratio from '/imports/ui/components/general/Ratio.jsx';

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
    DocHead.setTitle('Finances - e-Potek');
  }

  render() {
    return (
      <section className="mask1 animated fadeIn">
        <h1>Finances</h1>

        <article>
          <h2 className="text-center">Mon Projet</h2>
          <ProjectChart
            horizontal
            name={this.props.loanRequest.property.address1}
            propertyValue={this.props.loanRequest.property.value}
            fortuneUsed={this.props.loanRequest.general.fortuneUsed}
            insuranceFortuneUsed={
              this.props.loanRequest.general.insuranceFortuneUsed
            }
          />
        </article>

        <article style={styles.article2}>
          <h2 className="text-center">Coût Mensuel Estimé*</h2>
          <p className="text-center" style={styles.p}>
            *Taux d'intérêt fictif de 1.5%
          </p>
          <ExpensesChart loanRequest={this.props.loanRequest} />
        </article>

        {/* <FinanceFAQ /> */}

      </section>
    );
  }
}

FinancePage.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
