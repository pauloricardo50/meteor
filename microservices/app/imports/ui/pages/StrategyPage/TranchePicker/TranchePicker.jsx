import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Button from 'core/components/Button';
import { T } from 'core/components/Translation';
import { getLoanValue } from 'core/utils/loanFunctions';
import withLoan from 'core/containers/withLoan';
import { loanUpdate } from 'core/api';
import Tranche from './Tranche';
import TrancheChart from './TrancheChart';

const types = [
  'interestLibor',
  'interest1',
  'interest2',
  'interest5',
  'interest10',
];

class TranchePicker extends Component {
  constructor(props) {
    super(props);
    this.state = { tranches: this.props.loan.general.loanTranches || [] };
  }

  componentWillReceiveProps(nextProps) {
    // Make sure state is in sync with DB
    if (
      JSON.stringify(nextProps.loan.general.loanTranches) !==
      JSON.stringify(this.props.loan.general.loanTranches)
    ) {
      this.setState({ tranches: nextProps.loan.general.loanTranches });
    }
  }

  getTrancheOptions = (type) => {
    // Filter out existing types, except the currentValue
    const existingTypes = this.state.tranches.map(t => t.type);
    return [...types.filter(t => existingTypes.indexOf(t) < 0), type];
  };

  changeTranche = (type, key, value) => {
    const tranches = this.state.tranches.slice();
    const tranche = tranches.find(t => t.type === type);
    tranche[key] = value;
    this.setState({ tranches });
  };

  deleteTranche = type =>
    this.setState(prev => ({
      tranches: prev.tranches.filter(tranche => tranche.type !== type),
    }));

  handleAddTranche = () => {
    const tranches = this.state.tranches.slice();
    const existingTypes = tranches.map(t => t.type);

    if (tranches.length === types.length) return;

    // Add the first available type of interest from the remaining ones
    tranches.push({
      value: 100000,
      type: types.filter(type => existingTypes.indexOf(type) < 0)[0],
    });
    this.setState({ tranches });
  };

  handleSave = () => {
    loanUpdate.run({
      object: { 'general.loanTranches': this.state.tranches },
      loanId: this.props.loan._id,
    });
  };

  render() {
    const { tranches } = this.state;
    const { loan, property } = this.props;

    const disableAdd = tranches.length >= types.length;

    return (
      <div className="tranche-picker">
        <div className="picker-content">
          <div className="selector">
            {tranches.map(tranche => (
              <Tranche
                tranche={tranche}
                key={tranche.type}
                deleteTranche={this.deleteTranche}
                changeTranche={this.changeTranche}
                options={this.getTrancheOptions(tranche.type)}
              />
            ))}
            <a
              onClick={disableAdd ? null : this.handleAddTranche}
              style={{ paddingTop: 16 }}
              className={classnames({
                disabled: disableAdd,
                'animated pulse': tranches.length === 0,
              })}
            >
              <T id="TranchePicker.add" />
            </a>
          </div>
          {tranches.length && (
            <TrancheChart
              tranches={tranches}
              total={getLoanValue({ property, loan }, true)}
            />
          )}
        </div>
        <Button
          raised
          primary
          label={<T id="general.save" />}
          style={{ marginTop: 16 }}
          disabled={
            tranches.length === 0 ||
            JSON.stringify(tranches) ===
              JSON.stringify(this.props.loan.general.loanTranches)
          }
          onClick={this.handleSave}
        />
      </div>
    );
  }
}

TranchePicker.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
  offers: PropTypes.arrayOf(PropTypes.object).isRequired,
  property: PropTypes.objectOf(PropTypes.any).isRequired,
};
export default withLoan(TranchePicker);
