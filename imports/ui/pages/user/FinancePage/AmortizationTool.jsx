import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import MaskedInput from 'react-text-mask';

import AmortizationChart from '/imports/ui/components/charts/AmortizationChart';
import { T } from '/imports/ui/components/general/Translation';
import { percentMask } from '/imports/js/helpers/textMasks';

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

    this.state = { value: 0, initialRate: 0.015 * 100 };

    this.totalYears = 20;
  }

  handleSelectChange = (event, index, value) => this.setState({ value });

  handleTextChange = event => this.setState({ initialRate: event.target.value });

  getRates = () => {
    const array = [];

    for (let i = 0; i <= this.totalYears; i += 1) {
      if (i <= 10) {
        array[i] = parseFloat(this.state.initialRate) / 100 || 0;
      } else {
        array[i] = interestRates[this.state.value].rate;
      }
    }

    return array;
  };

  render() {
    return (
      <div className="mask1">
        <div style={styles.div}>
          <TextField
            floatingLabelText={<T id="AmortizationTool.initialRate" />}
            onChange={this.handleTextChange}
          >
            <MaskedInput mask={percentMask} guide value={this.state.initialRate} />
          </TextField>
          <SelectField
            floatingLabelText={<T id="AmortizationTool.futureRate" />}
            value={this.state.value}
            onChange={this.handleSelectChange}
          >
            {interestRates.map((r, i) =>
              <MenuItem
                value={i}
                key={r.id}
                primaryText={<T id={`AmortizationTool.${r.id}.title`} />}
                label={<T id={'AmortizationTool.rate'} values={{ rate: r.rate }} />}
              />,
            )}
          </SelectField>
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
