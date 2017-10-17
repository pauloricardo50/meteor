import PropTypes from 'prop-types';
import React, { Component } from 'react';

import EmailLine from './EmailLine';
import PasswordLine from './PasswordLine';
import { T } from '/imports/ui/components/general/Translation';

const styles = {
  section: {
    margin: '50px 0 150px 0',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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
  }

  setParentState = (key, value, callback) => {
    const object = {};
    object[key] = value;
    this.setState(object, () => {
      if (typeof callback === 'function') {
        callback();
      }
    });
  };

  render() {
    const { showPassword, login, signUp } = this.state;
    return (
      <div style={styles.section}>
        <h2>
          <T id="StartSignUp.email" />
        </h2>
        <EmailLine {...this.state} setParentState={this.setParentState} />

        {showPassword && (
          <div className="animated fadeIn" style={styles.passwordDiv}>
            <h3 className="fixed-size">
              {login && <T id="StartSignUp.signedUp" />}
              {signUp && <T id="StartSignUp.notSignedUp" />}
            </h3>
            <PasswordLine
              history={this.props.history}
              {...this.state}
              formState={this.props.formState}
              setParentState={this.setParentState}
            />
          </div>
        )}
      </div>
    );
  }
}

StartSignUp.propTypes = {
  formState: PropTypes.objectOf(PropTypes.any).isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};
