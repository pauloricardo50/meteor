import PropTypes from 'prop-types';
import React, { Component } from 'react';

import notification from 'core/utils/notification';
import Button from 'core/components/Button';
import Dialog from 'core/components/Material/Dialog';
import TextField from 'core/components/Material/TextField';
import T from 'core/components/Translation';
import { loanUpdate } from 'core/api';

export default class NewLoanModal extends Component {
  constructor(props) {
    super(props);

    this.state = { open: this.props.open, name: '' };
  }

  handleChange = event => this.setState({ name: event.target.value });

  handleSubmit = (event) => {
    const { name } = this.state;
    const { loanId } = this.props;
    event.preventDefault();

    loanUpdate
      .run({ object: { name }, loanId })
      .then(() => this.setState({ open: false }))
      .then(() =>
        notification.success({ message: `C'est parti pour ${name}!` }));
  };

  render() {
    const { name, open } = this.state;
    const button = (
      <Button
        raised
        label="Ok"
        primary
        disabled={!name}
        onClick={this.handleSubmit}
      />
    );

    return (
      <Dialog
        title={<T id="NewLoanModal.title" />}
        actions={button}
        important
        open={open}
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
              value={name}
              onChange={this.handleChange}
            />
          </div>
        </form>
      </Dialog>
    );
  }
}

NewLoanModal.propTypes = {
  loanId: PropTypes.string,
  open: PropTypes.bool,
};

NewLoanModal.defaultProps = {
  open: false,
  loanId: '',
};
