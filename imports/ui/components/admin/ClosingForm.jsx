import React, { Component } from 'react';
import PropTypes from 'prop-types';

import DatePicker from '/imports/ui/components/general/Material/DatePicker';
import SelectField from '/imports/ui/components/general/Material/SelectField';
import MenuItem from '/imports/ui/components/general/Material/MenuItem';

import { confirmClosing } from '/imports/api/loanrequests/methods';

const schedules = ['monthly', 'yearly', 'semester'];

export default class ClosingForm extends Component {
  constructor(props) {
    super(props);
    this.state = { date: null, schedule: null };

    this.props.disableClose();
  }

  componentWillUnmount() {
    this.handleSubmit();
  }

  handleDateChange = (event, date) => this.setState({ date }, this.validate);

  handleSelectChange = (event, index, schedule) =>
    this.setState({ schedule }, this.validate);

  handleSubmit = () => {
    if (!(this.state.date && this.state.schedule) || this.props.isCancel) {
      return;
    }

    const object = {
      'logic.firstPaymentDate': this.state.date,
      'logic.paymentSchedule': this.state.schedule,
    };
    confirmClosing.call({ id: this.props.loanRequest._id, object });
  };

  validate = () => {
    if (this.state.date && this.state.schedule) {
      this.props.enableClose();
    } else {
      this.props.disableClose();
    }
  };

  render() {
    return (
      <div>
        <DatePicker
          hintText="Première date de paiement"
          value={this.state.date}
          onChange={this.handleDateChange}
        />
        <SelectField
          floatingLabelText="Fréquence de paiement"
          value={this.state.schedule}
          onChange={this.handleSelectChange}
        >
          {schedules.map(s => <MenuItem key={s} value={s} primaryText={s} />)}
        </SelectField>
      </div>
    );
  }
}

ClosingForm.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  enableClose: PropTypes.func,
  disableClose: PropTypes.func,
  isCancel: PropTypes.bool,
};

ClosingForm.defaultProps = {
  enableClose: () => {},
  disableClose: () => {},
  isCancel: false,
};
