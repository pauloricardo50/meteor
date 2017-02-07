import React, { Component, PropTypes } from 'react';
import { DocHead } from 'meteor/kadira:dochead';

import RaisedButton from 'material-ui/RaisedButton';


import PropertyChart from '/imports/ui/components/charts/PropertyChart.jsx';
import ProjectChart from '/imports/ui/components/charts/ProjectChart.jsx';
import ExpensesChart from '/imports/ui/components/charts/ExpensesChart.jsx';

const styles = {
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
      <div>
        <div className="form-group">
          <RaisedButton
            icon={<span className="fa fa-angle-left" />}
            label="Retour"
            className="animated slideInLeft"
            href="/main"
          />
        </div>
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

          <article>
            <h3 className="text-center">Coût Mensuel Estimé*</h3>
            <p className="text-center">*Taux d&apos;intérêt fictif de 1.5%</p>
            <ExpensesChart loanRequest={this.props.loanRequest} />
          </article>

        </section>
      </div>
    );
  }
}

FinancePage.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
