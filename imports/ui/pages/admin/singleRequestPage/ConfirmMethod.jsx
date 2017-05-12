import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

export default class ConfirmMethod extends Component {
  state = {
    open: false,
    text: '',
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleSubmit = () => {
    this.props.method((err, res) => {
      if (!err) {
        this.setState({ open: false });
      }
    });
  };

  handleChange = event => {
    this.setState({
      text: event.target.value,
    });
  };

  render() {
    const actions = [
      <FlatButton label="Annuler" primary onTouchTap={this.handleClose} />,
      <FlatButton
        label="Okay"
        primary
        disabled={this.state.text !== this.props.keyword}
        onTouchTap={this.handleSubmit}
      />,
    ];

    return (
      <div>
        <RaisedButton
          label={this.props.label}
          onTouchTap={this.handleOpen}
          style={this.props.style}
          disabled={this.props.disabled}
        />
        <Dialog title="Êtes-vous sûr?" actions={actions} modal open={this.state.open}>
          Tapez le mot "{this.props.keyword}" pour valider cette action.

          <div><TextField autoFocus onChange={this.handleChange} /></div>
        </Dialog>
      </div>
    );
  }
}

ConfirmMethod.propTypes = {
  label: PropTypes.string.isRequired,
  keyword: PropTypes.string.isRequired,
  method: PropTypes.func.isRequired,
};
