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
  button: {
    marginTop: 16,
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

    this.state = { validating: false, error: false, errorMessage: '' };
    this.timer = null;
  }

  handleChange = (event) => {
    const { setParentState } = this.props;
    const email = event.target.value;
    setParentState('email', email);
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { email, setParentState } = this.props;

    if (emailValidation(email)) {
      this.setState({ error: false, errorMessage: '', validating: true });
      // Check if the email exists in the database
      Meteor.call('doesUserExist', email, (error, result) => {
        if (result) {
          this.setState({ validating: false });

          // If it exists
          setParentState('login', true);
          setParentState('signUp', false);
          setParentState('showPassword', true, () => scroll());
        } else {
          // If it doesnt
          this.props.handleNewEmail(() => this.setState({ validating: false }));
        }
      });
    } else {
      this.setState({ error: true, errorMessage: 'Email invalide' });
      setParentState('showPassword', false, () => scroll());
    }
  };

  render() {
    const { validating, error, errorMessage } = this.state;
    const { showPassword } = this.props;

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
          value={this.props.email}
          onChange={this.handleChange}
          type="email"
          fullWidth
          error={error}
          helperText={errorMessage}
          noValidate
        />
        {!showPassword && (
          <Button
            type="submit"
            style={styles.button}
            disabled={validating}
            primary
            raised
          >
            <T id="general.continue" />
          </Button>
        )}
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
