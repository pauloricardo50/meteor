import React, { Component, PropTypes } from 'react';
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

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
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
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

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
        title="Entrez le nom de la rue et le numéro"
        actions={button}
        modal
        open={this.state.open}
      >
        <p className="secondary">
          Ça nous permet de donner un nom à votre projet
        </p>

        <form onSubmit={this.handleSubmit}>
          <div className="text-center">
            <TextField
              name="address"
              hintText="Rue du Pré 2"
              floatingLabelText="Adresse du bien immobilier"
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
