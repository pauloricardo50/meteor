import React, { Component, PropTypes } from 'react';
import { DocHead } from 'meteor/kadira:dochead';

import RaisedButton from 'material-ui/RaisedButton';


import PropertyChart from '/imports/ui/components/charts/PropertyChart.jsx';
import ProjectChart from '/imports/ui/components/charts/ProjectChart.jsx';
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
  h3: {
    paddingBottom: 50,
  },
  modify: {
    paddingBottom: 50,
    display: 'inline-block',
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

        <article>
          <h3 className="text-center">Mon Projet</h3>
          {/* <PropertyChart creditRequest={this.props.creditRequest} /> */}
          <ProjectChart creditRequest={this.props.creditRequest} horizontal />
        </article>

        <article>
          <h3 className="text-center">Coût Mensuel Estimé*</h3>
          <p className="text-center">*Taux d'intérêt fictif de 1.5%</p>
          <ExpensesChart creditRequest={this.props.creditRequest} />
        </article>

        <article style={styles.modify} className="col-xs-12">
          <h3 className="text-center" style={styles.h3}>Modifier</h3>
          <div className="col-xs-6 text-center">
            <RaisedButton
              label="Modifier Fonds Propres"
              primary
            />
          </div>
          <div className="col-xs-6 text-center">
            <RaisedButton
              href="/finance/strategy"
              label="Choisir Stratégie de Taux"
              primary
            />
          </div>
        </article>

      </section>
    );
  }
}

FinancePage.propTypes = {
  creditRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
