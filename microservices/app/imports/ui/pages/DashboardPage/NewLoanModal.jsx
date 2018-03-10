import PropTypes from 'prop-types';
import React, { Component } from 'react';
import cleanMethod from 'core/api/cleanMethods';

import Button from 'core/components/Button';
import Dialog from 'core/components/Material/Dialog';
import TextField from 'core/components/Material/TextField';

import { T } from 'core/components/Translation';

export default class NewLoanModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: this.props.open,
      value: '',
    };
  }

  handleChange = (event) => {
    this.setState({ value: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const object = { name: this.state.value };

    cleanMethod(
      'loanUpdate',
      { object, id: this.props.loanId },
      {
        title: `C'est parti pour ${this.state.value}`,
        message:
          '<h4 class="bert">Vous pouvez avancer quand vous voulez, et à votre rythme. Vous trouverez toujours tout ici, à sa place.</h4>',
        style: 'fixed-top',
        delay: 15000,
      },
    ).then(() => this.setState({ open: false }));
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
