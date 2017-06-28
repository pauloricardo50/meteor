import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import Scroll from 'react-scroll';

import TextField from 'material-ui/TextField';
import MaskedInput from 'react-text-mask';
import emailMask from 'text-mask-addons/dist/emailMask';

import { emailValidation } from '/imports/js/helpers/validation';

const styles = {
  textField: {
    fontSize: 'inherit',
    width: 350,
    maxWidth: '80%',
  },
  button: {
    marginRight: 8,
    marginBottom: 8,
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

  handleChange = event => {
    const email = event.target.value;
    Meteor.clearTimeout(this.timer);
    this.props.setParentState('email', email);

    if (emailValidation(email)) {
      this.timer = Meteor.setTimeout(() => {
        // Check if the email exists in the database
        Meteor.call('doesUserExist', email, (error, result) => {
          if (result) {
            // If it exists
            this.setState({
              emailExists: true,
            });
            this.props.setParentState('login', true);
            this.props.setParentState('signUp', false);
          } else {
            // If it doesnt
            this.setState({
              emailExists: false,
            });
            this.props.setParentState('login', false);
            this.props.setParentState('signUp', true);
          }
          this.props.setParentState('showPassword', true, () => scroll());
        });
      }, 400);
    } else {
      this.props.setParentState('showPassword', false, () => scroll());
    }
  };

  render() {
    return (
      <div>
        <h1 className="email fixed-size">
          <TextField
            style={styles.textField}
            name="email"
            value={this.props.email}
            onChange={this.handleChange}
            type="email"
          />
        </h1>
      </div>
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
