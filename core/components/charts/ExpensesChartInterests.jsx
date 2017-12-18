import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { T } from 'core/components/Translation';
import Select from 'core/components/Select';
import ExpensesChart from './ExpensesChart';

const rates = [0.01, 0.01, 0.015, 0.02];

const options = [
  {
    id: 0,
    label: <T id="ExpensesChartInterests.libor" values={{ value: rates[0] }} />,
  },
  {
    id: 1,
    label: (
      <T
        id="ExpensesChartInterests.years"
        values={{ value: rates[1], years: 5 }}
      />
    ),
  },
  {
    id: 2,
    label: (
      <T
        id="ExpensesChartInterests.years"
        values={{ value: rates[2], years: 10 }}
      />
    ),
  },
  {
    id: 3,
    label: (
      <T
        id="ExpensesChartInterests.years"
        values={{ value: rates[3], years: 15 }}
      />
    ),
  },
];

export default class ExpensesChartInterests extends Component {
  constructor(props) {
    super(props);

    this.state = { selectValue: 2 };
  }

  handleChange = (_, selectValue) => this.setState({ selectValue });

  render() {
    const { selectValue } = this.state;
    const { loan } = this.props;

    return (
      <div className="interestPicker flex-col center">
        <ExpensesChart
          {...this.props}
          interests={loan * rates[selectValue] / 12}
          interestRate={rates[selectValue]}
        />
        {/* Add a div for easier styling */}
        <div style={{ width: 180, marginTop: 16 }}>
          <Select
            id="ExpensesChartInterests"
            label={<T id="ExpensesChartInterests.selectFieldLabel" />}
            value={selectValue}
            renderValue={value => options.find(o => o.id === value).label}
            onChange={this.handleChange}
            style={{ width: '100%' }}
            options={options}
          />
        </div>
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
