import React, { Component } from 'react';

import TextInput from '/imports/ui/components/general/TextInput';
import Button from '/imports/ui/components/general/Button';
import { T } from '/imports/ui/components/general/Translation';

const styles = {
  input: {
    width: 240,
  },
  buttonDiv: { justifyContent: 'space-between', marginTop: 32 },
  button: {
    marginRight: 8,
  },
};

export default class Form extends Component {
  constructor(props) {
    super(props);

    this.state = { email: '', password: '' };
  }

  handleChange = (key, value) => this.setState({ [key]: value });

  render() {
    const { email, password } = this.state;
    return (
      <div className="flex-col center">
        <TextInput
          label={<T id="LoginForm.email" />}
          value={email}
          handleChange={this.handleChange}
          id="email"
          style={styles.input}
        />
        <TextInput
          label={<T id="LoginForm.password" />}
          value={password}
          type="password"
          handleChange={this.handleChange}
          id="password"
          style={styles.input}
        />
        <div className="flex" style={styles.buttonDiv}>
          <Button raised color="primary" style={styles.button}>
            <T id="general.login" />
          </Button>
          <Button raised color="primary">
            <T id="general.signup" />
          </Button>
        </div>
      </div>
    );
  }
}

Form.propTypes = {};
