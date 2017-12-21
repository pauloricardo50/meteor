import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import Scroll from 'react-scroll';

import TextField from 'core/components/Material/TextField';
import Button from 'core/components/Button';
import { emailValidation } from 'core/utils/validation';
import { T } from 'core/components/Translation';

const styles = {
  root: {
    width: 350,
    maxWidth: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  buttons: {
    marginTop: 16,
    display: 'flex',
    flexDirection: 'row',
  },
  button: {
    marginRight: 8,
  },
};

const scroll = () => {
  Meteor.defer(() => {
    const options = {
      duration: 350,
      delay: 0,
      smooth: true,
      ignoreCancelEvents: true,
    };
    Scroll.animateScroll.scrollToBottom(options);
  });
};

export default class EmailLine extends Component {
  constructor(props) {
    super(props);
  }

  handleChange = (event) => {
    const { setParentState } = this.props;
    const email = event.target.value;
    setParentState('email', email);
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { email, setParentState, handleNewEmail } = this.props;

    if (emailValidation(email)) {
      // Check if the email exists in the database
      Meteor.call('doesUserExist', email, (error, result) => {
        if (result) {
        } else {
          // If it doesnt
          handleNewEmail();
        }
      });
    }
  };

  render() {
    const {
      showPassword,
      email,
      handleExistingAccount,
      loading,
      errorText,
    } = this.props;

    return (
      <form
        className="email fixed-size"
        style={styles.root}
        action="submit"
        onSubmit={this.handleSubmit}
        noValidate
      >
        <TextField
          style={styles.input}
          name="email"
          value={email}
          onChange={this.handleChange}
          type="email"
          fullWidth
          error={!!errorText}
          helperText={errorText}
          noValidate
        />
        <div style={styles.buttons}>
          <Button
            type="submit"
            style={styles.button}
            disabled={loading}
            primary
            raised
          >
            <T id="general.continue" />
          </Button>
          <Button
            onClick={handleExistingAccount}
            style={styles.button}
            disabled={loading}
            raised
          >
            <T id="EmailLine.alreadyAnAccount" />
          </Button>
        </div>
      </form>
    );
  }
}

EmailLine.propTypes = {
  setParentState: PropTypes.func.isRequired,
  email: PropTypes.string,
};

EmailLine.defaultProps = {
  email: '',
};
