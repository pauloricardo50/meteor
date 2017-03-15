import React, { PropTypes } from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import ExpensesChart from '/imports/ui/components/charts/ExpensesChart.jsx';
import Start2Recap from '/imports/ui/components/start/Start2Recap.jsx';

import constants from '/imports/js/constants';
import { toMoney } from '/imports/js/conversionFunctions';

export default class StartResult extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const loan = this.props.propAndWork - (this.props.fortuneUsed || 0);
    return (
      <article className="mask1 start-result">
        <h1>Résultat: <span className="success">Excellent</span></h1>

        <div className="content">
          <Start2Recap {...this.props} />
          <div className="chart">
            <h3>Votre emprunt: CHF {toMoney(loan)}</h3>
            <ExpensesChart
              interests={loan * constants.interestsReal / 12}
              amortizing={loan * constants.amortizing / 12}
              maintenance={
                this.props.propAndWork * constants.maintenanceReal / 12
              }
            />
          </div>
        </div>

        <div className="button">
          <RaisedButton label="terminer la demo" href="/" primary />
        </div>
      </article>
    );
  }
}

StartResult.propTypes = {
  income: PropTypes.number,
  fortune: PropTypes.number,
  property: PropTypes.number,
};
