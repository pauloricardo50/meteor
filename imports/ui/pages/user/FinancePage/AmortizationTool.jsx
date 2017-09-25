import React, { Component } from 'react';
import PropTypes from 'prop-types';

// import SelectField from '/imports/ui/components/general/Material/SelectField';
// import MenuItem from '/imports/ui/components/general/Material/MenuItem';
// import TextField from '/imports/ui/components/general/Material/TextField';
// import MaskedInput from 'react-text-mask';

import Select from '/imports/ui/components/general/Select';
import TextInput from '/imports/ui/components/general/TextInput';

import AmortizationChart from '/imports/ui/components/charts/AmortizationChart';
import { T } from '/imports/ui/components/general/Translation';
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

    this.state = { value: 0, initialRate: 0.015 * 100 };

    this.totalYears = 20;
  }

  handleSelectChange = (event, index, value) => this.setState({ value });

  handleTextChange = event =>
    this.setState({ initialRate: event.target.value });

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
          <TextInput
            label={<T id="AmortizationTool.initialRate" />}
            handleChange={this.handleTextChange}
            type="percent"
            value={this.state.initialRate}
          >
            {/* <MaskedInput
              mask={percentMask}
              guide
              value={this.state.initialRate}
            /> */}
          </TextInput>
          <Select
            label={<T id="AmortizationTool.futureRate" />}
            value={this.state.value}
            handleChange={this.handleSelectChange}
            options={interestRates.map(rate => ({
              id: rate.id,
              label: <T id={`AmortizationTool.${rate.id}.title`} />,
            }))}
            renderValue={id => (
              <T
                id={'AmortizationTool.rate'}
                values={{ rate: interestRates.find(i => i.id === id).rate }}
              />
            )}
          >
            {/* {interestRates.map((r, i) => (
              <MenuItem
                value={i}
                key={r.id}
                primaryText={<T id={`AmortizationTool.${r.id}.title`} />}
                label={
                  <T id={'AmortizationTool.rate'} values={{ rate: r.rate }} />
                }
              />
            ))} */}
          </Select>
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
