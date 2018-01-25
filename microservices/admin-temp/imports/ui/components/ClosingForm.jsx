import React, { Component } from 'react';
import PropTypes from 'prop-types';

import DateInput from 'core/components/DateInput';
import Select from 'core/components/Select';
import { confirmClosing } from 'core/api/loanrequests/methods';
import { PAYMENT_SCHEDULES } from 'core/api/constants';

const schedules = Object.values(PAYMENT_SCHEDULES);

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
        <DateInput
          placeholder="Première date de paiement"
          value={this.state.date}
          onChange={this.handleDateChange}
        />
        <Select
          label="Fréquence de paiement"
          value={this.state.schedule}
          onChange={this.handleSelectChange}
          options={schedules.map(s => ({ id: s, label: s }))}
          renderValue={val => val}
        />
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
