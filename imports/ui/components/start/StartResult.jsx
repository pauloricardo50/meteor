import React, { PropTypes } from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import ExpensesChart from '/imports/ui/components/charts/ExpensesChart.jsx';
import Start2Recap from '/imports/ui/components/start/Start2Recap.jsx';

import constants from '/imports/js/constants';
import { toMoney } from '/imports/js/conversionFunctions';

const StartResult = props => {
  const loan = props.project - props.fortuneUsed;

  return (
    <article className="mask1 start-result">
      <h1>Résultat: <span className="success">Excellent</span></h1>

      <div className="content">
        <Start2Recap {...props} />
        <div className="chart">
          <h3>
            Votre emprunt: <span className="active">CHF {toMoney(loan)}</span>
          </h3>
          <ExpensesChart
            interests={loan * constants.interestsReal / 12}
            amortizing={loan * constants.amortizing / 12}
            maintenance={props.propAndWork * constants.maintenanceReal / 12}
          />
        </div>
      </div>

      <div className="button">
        <RaisedButton label="terminer la demo" href="/" primary />
      </div>
    </article>
  );
};

StartResult.defaultProps = {
  propAndWork: 0,
  fortuneUsed: 0,
};

StartResult.propTypes = {
  propAndWork: PropTypes.number,
  fortuneUsed: PropTypes.number,
};

export default StartResult;
