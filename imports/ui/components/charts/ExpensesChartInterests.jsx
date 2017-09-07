import PropTypes from 'prop-types';
import React, { Component } from 'react';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import ExpensesChart from './ExpensesChart';
import { T } from '/imports/ui/components/general/Translation';
import track from '/imports/js/helpers/analytics';

const rates = [0.01, 0.01, 0.015, 0.02];

export default class ExpensesChartInterests extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectValue: 2,
    };
  }

  handleChange = (event, index, selectValue) => {
    track('ExpensesChartInterests - changed interest rate', {
      value: selectValue,
    });
    this.setState({ selectValue });
  };

  render() {
    return (
      <div className="interestPicker text-center">
        <ExpensesChart
          {...this.props}
          interests={this.props.loan * rates[this.state.selectValue] / 12}
          interestRate={rates[this.state.selectValue]}
        />
        <SelectField
          floatingLabelText={<T id="ExpensesChartInterests.selectFieldLabel" />}
          value={this.state.selectValue}
          onChange={this.handleChange}
          style={{ textAlign: 'left' }}
          autoWidth
        >
          <MenuItem
            value={0}
            primaryText={
              <T
                id="ExpensesChartInterests.libor"
                values={{ value: rates[0] }}
              />
            }
          />
          <MenuItem
            value={1}
            primaryText={
              <T
                id="ExpensesChartInterests.years"
                values={{ value: rates[1], years: 5 }}
              />
            }
          />
          <MenuItem
            value={2}
            primaryText={
              <T
                id="ExpensesChartInterests.years"
                values={{ value: rates[2], years: 10 }}
              />
            }
          />
          <MenuItem
            value={3}
            primaryText={
              <T
                id="ExpensesChartInterests.years"
                values={{ value: rates[3], years: 15 }}
              />
            }
          />
        </SelectField>
      </div>
    );
  }
}

ExpensesChartInterests.propTypes = {
  loan: PropTypes.number,
};

ExpensesChartInterests.defaultProps = {
  loan: 0,
};
