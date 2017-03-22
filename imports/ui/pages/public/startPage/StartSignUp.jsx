import React, { Component, PropTypes } from 'react';

import EmailLine from './EmailLine.jsx';
import PasswordLine from './PasswordLine.jsx';

const styles = {
  section: {
    margin: '50px 0',
    width: '100%',
  },
  passwordDiv: {
    marginTop: 40,
  },
  button: {
    marginRight: 8,
    marginBottom: 8,
  },
};

export default class StartSignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.setParentState = this.setParentState.bind(this);
  }

  setParentState(key, value) {
    const object = {};
    object[key] = value;
    this.setState(object);
  }

  render() {
    return (
      <section className="text-center" style={styles.section}>
        <h2>Entrez votre adresse email</h2>
        <EmailLine {...this.state} setParentState={this.setParentState} />

        {this.state.showPassword &&
          (this.state.login || this.state.signUp) &&
          <div className="animated fadeIn" style={styles.passwordDiv}>
            <h2>
              {this.state.login && 'Entrez votre mot de passe'}
              {this.state.signUp && 'Entrez votre nouveau mot de passe'}
            </h2>
            <PasswordLine
              {...this.state}
              formState={this.props.formState}
              setParentState={this.setParentState}
            />
          </div>}

      </section>
    );
  }
}

StartSignUp.propTypes = {};
