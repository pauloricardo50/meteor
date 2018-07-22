import React, { Component } from 'react';
import PropTypes from 'prop-types';

import DateInput from 'core/components/DateInput';
import Select from 'core/components/Select';
import { PAYMENT_SCHEDULES } from 'core/api/constants';
import { confirmClosing } from 'core/api';

const schedules = Object.values(PAYMENT_SCHEDULES);

export default class ClosingForm extends Component {
  constructor(props) {
    super(props);
    this.state = { date: null, schedule: '' };

    this.props.disableClose();
  }

  componentWillUnmount() {
    this.handleSubmit();
  }

  handleDateChange = (event, date) => this.setState({ date }, this.validate);

  handleSelectChange = (event, index, schedule) =>
    this.setState({ schedule }, this.validate);

  handleSubmit = () => {
    const { date, schedule } = this.state;

    if (!(date && schedule) || this.props.isCancel) {
      return;
    }

    const object = {
      'logic.firstPaymentDate': date,
      'logic.paymentSchedule': schedule,
    };
    confirmClosing.run({ loanId: this.props.loan._id, object });
  };

  validate = () => {
    const { date, schedule } = this.state;
    if (date && schedule) {
      this.props.enableClose();
    } else {
      this.props.disableClose();
    }
  };

  render() {
    const { date, schedule } = this.state;

    return (
      <React.Fragment>
        <DateInput
          placeholder="Première date de paiement"
          value={date}
          onChange={this.handleDateChange}
        />
        <Select
          label="Fréquence de paiement"
          value={schedule}
          onChange={this.handleSelectChange}
          options={schedules.map(s => ({ id: s, label: s }))}
          renderValue={val => val}
        />
      </React.Fragment>
    );
  }
}

ClosingForm.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
  enableClose: PropTypes.func,
  disableClose: PropTypes.func,
  isCancel: PropTypes.bool,
};

ClosingForm.defaultProps = {
  enableClose: () => {},
  disableClose: () => {},
  isCancel: false,
};
