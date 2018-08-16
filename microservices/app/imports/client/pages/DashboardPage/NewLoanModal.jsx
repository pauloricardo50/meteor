import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Button from 'core/components/Button';
import Dialog from 'core/components/Material/Dialog';
import TextField from 'core/components/Material/TextField';
import T from 'core/components/Translation';
import { loanUpdate } from 'core/api';

const STEPS = {
  LOAN_NAME: 'LOAN_NAME',
  PROPERTY_VALUE: 'PROPERTY_VALUE',
  BORROWER_SALARY: 'BORROWER_SALARY',
};

export default class NewLoanModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: this.props.open,
      step: STEPS.LOAN_NAME,
      loanName: null,
      propertyValue: null,
      borrowerSalary: null,
    };
  }

  // handleChange = event => this.setState({ value: event.target.value });

  handleChange = (event) => {
    switch (this.state.step) {
    case STEPS.LOAN_NAME:
      this.setState({ loanName: event.target.value });
      break;
    case STEPS.PROPERTY_VALUE:
      this.setState({ propertyValue: event.target.value });
      break;
    case STEPS.BORROWER_SALARY:
      this.setState({ borrowerSalary: event.target.value });
      break;
    default:
      break;
    }
  };

  // handleSubmit = (event) => {
  //   event.preventDefault();

  //   loanUpdate
  //     .run({ object: { name: this.state.value }, loanId: this.props.loanId })
  //     .then(() => this.setState({ open: false }));
  // };

  handleSubmit = (event) => {
    event.preventDefault();
    switch (this.state.step) {
    case STEPS.LOAN_NAME:
      this.setState({ step: STEPS.PROPERTY_VALUE });
      break;
    case STEPS.PROPERTY_VALUE:
      this.setState({ step: STEPS.BORROWER_SALARY });
      break;
    case STEPS.BORROWER_SALARY:
      this.setState({ step: STEPS.LOAN_NAME });
      break;
    default:
      break;
    }
  };

  renderTextField = () => {
    switch (this.state.step) {
    case STEPS.LOAN_NAME:
      this.setState({ step: STEPS.PROPERTY_VALUE });
      break;
    case STEPS.PROPERTY_VALUE:
      this.setState({ step: STEPS.BORROWER_SALARY });
      break;
    case STEPS.BORROWER_SALARY:
      this.setState({ step: STEPS.LOAN_NAME });
      break;
    }
  };

  render() {
    const button = (
      <Button
        raised
        label="Ok"
        primary
        disabled={!this.state.value}
        onClick={this.handleSubmit}
      />
    );

    return (
      <Dialog
        title={<T id="NewLoanModal.title" />}
        actions={button}
        important
        open={this.state.open}
      >
        <p className="secondary">
          <T id="NewLoanModal.description" />
        </p>

        <form onSubmit={this.handleSubmit}>
          <div className="text-center">
            <TextField
              name="address"
              hintText={<T id="NewLoanModal.placeholder" />}
              label={<T id="NewLoanModal.label" />}
              autoFocus
              value={this.state.value}
              onChange={this.handleChange}
            />
          </div>
        </form>
      </Dialog>
    );
  }
}

NewLoanModal.propTypes = {
  open: PropTypes.bool,
  loanId: PropTypes.string,
};

NewLoanModal.defaultProps = {
  open: false,
  loanId: '',
};
