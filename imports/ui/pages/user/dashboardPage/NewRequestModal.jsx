import PropTypes from 'prop-types';
import React, { Component } from 'react';
import cleanMethod from '/imports/api/cleanMethods';

import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

export default class NewRequestModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: this.props.open,
      value: '',
    };
  }

  handleChange = event => {
    this.setState({ value: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();

    const object = {
      name: this.state.value,
    };

    cleanMethod(
      'updateRequest',
      object,
      this.props.requestId,
      () => {
        this.setState({ open: false });
        this.props.history.push('/app');
      },
      {
        title: 'Formidable',
        message: `<h4 class="bert">C'est parti pour ${this.state.value}</h4>`,
      },
    );
  };

  render() {
    const button = (
      <RaisedButton
        label="Ok"
        primary
        disabled={!this.state.value}
        onTouchTap={this.handleSubmit}
      />
    );

    return (
      <Dialog
        title="Donnez un nom à votre Projet"
        actions={button}
        modal
        open={this.state.open}
      >
        <p className="secondary">
          Ça nous permettra de l'identifier
        </p>

        <form onSubmit={this.handleSubmit}>
          <div className="text-center">
            <TextField
              name="address"
              hintText="Rue du Pré 2"
              floatingLabelText="Nom du projet"
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
