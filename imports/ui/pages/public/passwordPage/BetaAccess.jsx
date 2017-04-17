import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

export default class BetaAccess extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      error: '',
    };
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleSubmit = e => {
    e.preventDefault();

    // If you read this, write to me at florian@e-potek.ch, we're hiring curious people!
    if (this.password.input.value === 'goforlife') {
      this.props.history.push('/home');
    } else {
      this.setState({ error: 'Nope' });
    }
  };

  render() {
    const actions = [
      <FlatButton label="Annuler" onTouchTap={this.handleClose} />,
      <FlatButton label="Okay" primary onTouchTap={this.handleSubmit} />,
    ];

    return (
      <div>
        <RaisedButton label="Accéder à la Beta" onTouchTap={this.handleOpen} />
        <Dialog
          title="Accéder à la Beta"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <form
            action="submit"
            onSubmit={this.handleSubmit}
            className="text-center"
          >
            <TextField
              autoFocus
              floatingLabelText="Mot de passe"
              type="password"
              ref={r => {
                this.password = r;
              }}
              style={{ width: 100 }}
              errorText={this.state.error}
            />
          </form>
        </Dialog>
      </div>
    );
  }
}
