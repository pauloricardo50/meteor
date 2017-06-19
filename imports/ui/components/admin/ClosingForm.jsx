import React, { Component } from 'react';
import PropTypes from 'prop-types';

import DatePicker from 'material-ui/DatePicker';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

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

  handleSelectChange = (event, index, schedule) => this.setState({ schedule }, this.validate);

  handleSubmit = () => {
    if (!(this.state.date && this.state.schedule) || this.props.isCancel) {
      console.log('false');
      return false;
    }
    console.log('true');

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
  enableClose: PropTypes.func.isRequired,
  disableClose: PropTypes.func.isRequired,
  isCancel: PropTypes.bool.isRequired,
};
