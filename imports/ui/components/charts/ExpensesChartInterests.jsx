import React, { PropTypes } from 'react';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import ExpensesChart from './ExpensesChart.jsx';

const rates = [0.01, 0.01, 0.015, 0.02];

export default class ExpensesChartInterests extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectValue: 2,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event, index, selectValue) {
    this.setState({ selectValue });
  }

  render() {
    return (
      <div className="interestPicker text-center">
        <ExpensesChart
          {...this.props}
          interests={this.props.loan * rates[this.state.selectValue] / 12}
        />
        <SelectField
          floatingLabelText="Taux d'intérêt indicatif"
          value={this.state.selectValue}
          onChange={this.handleChange}
          style={{ textAlign: 'left' }}
        >
          <MenuItem value={0} primaryText="Libor moyen: 1.00%" />
          <MenuItem value={1} primaryText="5 ans moyen: 1.00%" />
          <MenuItem value={2} primaryText="10 ans moyen: 1.50%" />
          <MenuItem value={3} primaryText="15 ans moyen: 2.00%" />
        </SelectField>
      </div>
    );
  }
}

ExpensesChartInterests.propTypes = {};
