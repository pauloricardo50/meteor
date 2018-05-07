import React, { Component } from 'react';
import PropTypes from 'prop-types';

// import SelectField from 'core/components/Material/SelectField';
// import MenuItem from 'core/components/Material/MenuItem';
// import TextField from 'core/components/Material/TextField';
// import MaskedInput from 'react-text-mask';

import Select from 'core/components/Select';
import TextInput from 'core/components/TextInput';

import AmortizationChart from 'core/components/charts/AmortizationChart';
import { T } from 'core/components/Translation';
// import { percentMask } from '/imports/js/helpers/textMasks';

const interestRates = [
  { id: 'lower', rate: 0.008 },
  { id: 'stable', rate: 0.015 },
  { id: 'rise', rate: 0.03 },
  { id: 'catastrophy', rate: 0.08 },
];

const styles = {
  div: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
};

export default class AmortizationTool extends Component {
  constructor(props) {
    super(props);

    this.state = { initialRate: 0.015, futureRate: 'stable' };

    this.totalYears = 20;
  }

  handleSelectChange = (_, value) => this.setState({ futureRate: value });

  handleTextChange = (_, value) => this.setState({ initialRate: value });

  getRates = () => {
    const { initialRate, futureRate } = this.state;
    const array = [];

    for (let i = 0; i <= this.totalYears; i += 1) {
      if (i <= 10) {
        array[i] = parseFloat(initialRate) || 0;
      } else {
        array[i] = this.getRateById(futureRate);
      }
    }

    return array;
  };

  getRateById = id => interestRates.find(rate => rate.id === id).rate;

  render() {
    const { initialRate, futureRate } = this.state;

    return (
      <div className="mask1">
        <div style={styles.div}>
          <TextInput
            label={<T id="AmortizationTool.initialRate" />}
            onChange={this.handleTextChange}
            type="percent"
            value={initialRate}
            id="initialRate"
          />
          <Select
            label={<T id="AmortizationTool.futureRate" />}
            value={futureRate}
            onChange={this.handleSelectChange}
            options={interestRates.map(rate => ({
              id: rate.id,
              label: <T id={`AmortizationTool.${rate.id}.title`} />,
            }))}
            renderValue={id => (
              <T
                id="AmortizationTool.rate"
                values={{ rate: this.getRateById(id) }}
              />
            )}
          />
        </div>
        <AmortizationChart
          {...this.props}
          interestRates={this.getRates()}
          totalYears={this.totalYears}
        />
      </div>
    );
  }
}

AmortizationTool.propTypes = {};
