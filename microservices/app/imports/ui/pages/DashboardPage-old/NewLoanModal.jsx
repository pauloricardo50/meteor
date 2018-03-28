import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Button from 'core/components/Button';
import Dialog from 'core/components/Material/Dialog';
import TextField from 'core/components/Material/TextField';
import { T } from 'core/components/Translation';
import { loanUpdate } from 'core/api';

export default class NewLoanModal extends Component {
  constructor(props) {
    super(props);

    this.state = { open: this.props.open, value: '' };
  }

  handleChange = event => this.setState({ value: event.target.value });

  handleSubmit = (event) => {
    event.preventDefault();

    loanUpdate
      .run({ object: { name: this.state.value }, loanId: this.props.loanId })
      .then(() => this.setState({ open: false }));
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
