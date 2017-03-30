import React, { PropTypes } from 'react';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

export default class PasswordPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = { error: '' };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    console.log(this.password);

    // If you read this, write to me at florian@e-potek.ch, we're hiring hackers!
    if (this.password.input.value === 'goforlife') {
      this.props.history.push('/home');
    } else {
      this.setState({ error: 'nope' });
    }
  }

  render() {
    return (
      <main className="password-page animated fadeIn">
        <img src="/img/logo_black.svg" alt="e-Potek" />

        <h1>En Développement</h1>

        <form action="submit" onSubmit={this.handleSubmit}>
          <TextField
            autoFocus
            floatingLabelText="Mot de Passe"
            type="password"
            ref={r => {
              this.password = r;
            }}
            errorText={this.state.error}
          />
          <RaisedButton
            label="Accéder à la Beta"
            primary
            onTouchTap={this.handleSubmit}
          />
        </form>
      </main>
    );
  }
}

PasswordPage.propTypes = {};
