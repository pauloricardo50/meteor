import React, { PropTypes } from 'react';

import FortuneSliders from './lenderPickerPage/FortuneSliders.jsx';
import AmortizingPicker from './lenderPickerPage/AmortizingPicker.jsx';
import LoanStrategyPicker from './lenderPickerPage/LoanStrategyPicker.jsx';
import PartnerTable from './lenderPickerPage/PartnerTable.jsx';

export default class LenderPickerPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      partnerFilter: 'monthly',
      amortizing: this.props.loanRequest.general.amortizing,
      loanStrategyPreset: this.props.loanRequest.logic.loanStrategyPreset,
      loanTranches: this.props.loanRequest.general.loanTranches || [],
    };

    this.setFormState = this.setFormState.bind(this);
  }

  setFormState(id, value, callback, obj) {
    // If a whole object is given, set that object to state
    if (obj) {
      this.setState(obj, () => {
        if (typeof callback === 'function') {
          callback();
        }
      });
    } else {
      // Else, simple set one value to state
      const object = {};
      object[id] = value;

      this.setState(object, () => {
        if (typeof callback === 'function') {
          callback();
        }
      });
    }
  }

  handleSubmit() {
    const object = {};
  }

  render() {
    const props = {
      formState: this.state,
      setFormState: this.setFormState,
    };

    return (
      <section className="mask1 partner-picker">
        <h1>Choisissez votre prêteur</h1>

        <h2>1. Validez vos fonds propres</h2>
        <FortuneSliders {...props} loanRequest={this.props.loanRequest} />
        <hr />

        <AmortizingPicker {...props} />
        <hr />

        <LoanStrategyPicker {...props} loanRequest={this.props.loanRequest} />
        <hr />

        <PartnerTable {...props} offers={this.props.offers} />
      </section>
    );
  }
}

LenderPickerPage.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  offers: PropTypes.arrayOf(PropTypes.object),
};
