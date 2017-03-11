import React, {PropTypes} from 'react';


import RaisedButton from 'material-ui/RaisedButton';
import ExpensesChart from '/imports/ui/components/charts/ExpensesChart.jsx';
import StartRecap from '/imports/ui/components/start/StartRecap.jsx';

import constants from '/imports/js/constants';


export default class StartResult extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const loan = this.props.property - this.props.fortune;
    return (
      <article className="mask1 start-result">
        <h1>Résultat: <span className="success">Excellent</span></h1>

        {/* <div className="content">
          <StartRecap
            income={this.props.income}
            fortune={this.props.fortune}
            property={this.props.property}
            noPlaceholder
          />
          <ExpensesChart
            interests={loan * constants.interestsReal}
            amortizing={loan * constants.amortizing}
            maintenance={this.props.property * constants.maintenanceReal}
          />
        </div> */}

        <div className="button">
          <RaisedButton
            label="terminer la demo"
            href="/"
            primary
          />
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
