import PropTypes from 'prop-types';
import React, { Component } from 'react';
import cleanMethod from '/imports/api/cleanMethods';

import Button from '/imports/ui/components/general/Button';
import Dialog from 'core/components/Material/Dialog';
import TextField from 'core/components/Material/TextField';

import { T } from 'core/components/Translation';

export default class NewRequestModal extends Component {
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

    cleanMethod('updateRequest', object, this.props.requestId, {
      title: `C'est parti pour ${this.state.value}`,
      message:
        '<h4 class="bert">Vous pouvez avancer quand vous voulez, et à votre rythme. Vous trouverez toujours tout ici, à sa place.</h4>',
      style: 'fixed-top',
      delay: 15000,
    }).then(() => this.setState({ open: false }));
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
        title={<T id="NewRequestModal.title" />}
        actions={button}
        important
        open={this.state.open}
      >
        <p className="secondary">
          <T id="NewRequestModal.description" />
        </p>

        <form onSubmit={this.handleSubmit}>
          <div className="text-center">
            <TextField
              name="address"
              hintText={<T id="NewRequestModal.placeholder" />}
              label={<T id="NewRequestModal.label" />}
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

NewRequestModal.propTypes = {
  open: PropTypes.bool,
  requestId: PropTypes.string,
};

NewRequestModal.defaultProps = {
  open: false,
  requestId: '',
};
