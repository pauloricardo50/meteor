import React, { Component, PropTypes } from 'react';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';


const styles = {
  button:
};


export default class AutoStart extends Component {
  inputSwitch(input, index) {
    if (!input.show()) {
      return null;
    }

    switch (input.type) {
      case 'textInput':
        return (
          <div>
            <TextField
              floatingLabelText={input.label}
              onChange={e => this.props.changeState(input.id, e.target.value)}
              key={index}
            />
          </div>
        );
      case 'buttons':
        return (
          <div>
            <label htmlFor="">{input.label}</label>
            {input.answers.map((answer, index) => (
              <RaisedButton
                label={answer}
                primary
                onClick={e => this.props.changeState(input.id, answer)}
                key={index}
              />
            ))}
          </div>
        );
    }
  }

  render() {
    return (
      <form>
        {this.props.formArray.map((input, index) => this.inputSwitch(input, index))}
      </form>
    );
  }
}

AutoStart.propTypes = {
};
