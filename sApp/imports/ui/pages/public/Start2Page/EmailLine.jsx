import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import Scroll from 'react-scroll';

import TextField from '/imports/ui/components/general/Material/TextField';
import { emailValidation } from '/imports/js/helpers/validation';

const styles = {
  root: {
    width: 350,
    maxWidth: '100%',
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

    this.state = {};
    this.timer = null;
  }

  handleChange = (event) => {
    const { setParentState } = this.props;
    const email = event.target.value;
    Meteor.clearTimeout(this.timer);
    setParentState('email', email);

    if (emailValidation(email)) {
      this.timer = Meteor.setTimeout(() => {
        // Check if the email exists in the database
        Meteor.call('doesUserExist', email, (error, result) => {
          if (result) {
            // If it exists
            this.setState({ emailExists: true });
            setParentState('login', true);
            setParentState('signUp', false);
          } else {
            // If it doesnt
            this.setState({ emailExists: false });
            setParentState('login', false);
            setParentState('signUp', true);
          }
          setParentState('showPassword', true, () => scroll());
        });
      }, 400);
    } else {
      setParentState('showPassword', false, () => scroll());
    }
  };

  render() {
    return (
      <h2 className="email fixed-size" style={styles.root}>
        <TextField
          style={styles.input}
          name="email"
          value={this.props.email}
          onChange={this.handleChange}
          type="email"
          fullWidth
        />
      </h2>
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
