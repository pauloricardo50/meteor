import React from 'react';
import Dialog from 'core/components/Material/Dialog';
import Button from 'core/components/Button';
import TextField from 'core/components/Material/TextField';

export default class BetaAccess extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      error: '',
      value: '',
    };
  }

  handleClose = () => this.setState({ open: false });

  handleOpen = () => this.setState({ open: true });

  handleSubmit = (e) => {
    const { value } = this.state;
    e.preventDefault();

    // If you read this, write to me at florian@e-potek.ch, we're hiring curious people!
    if (value === 'goforlife') {
      this.props.history.push('/home');
    } else {
      this.setState({ error: 'Nope' });
    }
  };

  render() {
    const { value, error, open } = this.state;
    const actions = [
      <Button label="Annuler" onClick={this.handleClose} key={0} />,
      <Button label="Okay" primary onClick={this.handleSubmit} key={1} />,
    ];

    return (
      <div>
        <Button raised label="Accéder à la Beta" onClick={this.handleOpen} />
        <Dialog
          title="Accéder à la Beta"
          actions={actions}
          open={open}
          onClose={this.handleClose}
        >
          <form
            action="submit"
            onSubmit={this.handleSubmit}
            className="text-center"
          >
            <TextField
              autoFocus
              label="Mot de passe"
              type="password"
              inputRef={(r) => {
                this.password = r;
              }}
              style={{ width: 100 }}
              helperText={error}
              error={!!error}
              onChange={e => this.setState({ value: e.target.value })}
              value={value}
            />
          </form>
        </Dialog>
      </div>
    );
  }
}
