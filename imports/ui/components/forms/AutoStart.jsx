import React, { Component, PropTypes } from 'react';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';


const styles = {
  button: {
    marginRight: 8,
    marginLeft: 8,
  },
  buttonLabel: {
    marginBottom: 16,
  },
};


export default class AutoStart extends Component {
  inputSwitch(input, index) {
    if (!input.show()) {
      return null;
    }

    switch (input.type) {
      case 'numberInput':
      case 'dateInput':
      case 'textInput':
        return (
          <div className="animated fadeIn" key={index}>
            <TextField
              floatingLabelText={input.label}
              onChange={e => this.props.changeState(input.id, e.target.value)}
            />
          </div>
        );
      case 'buttons':
        return (
          <div className="animated fadeIn" key={index}>
            <label htmlFor="" style={styles.buttonLabel}>{input.label}</label>
            {input.answers.map((answer, index2) => (
              <RaisedButton
                label={answer}
                primary
                onClick={e => this.props.changeState(input.id, answer)}
                style={styles.button}
                disabled={!!this.props.formState[input.id]}
                key={index2}
              />
            ))}
          </div>
        );
      default: return null;
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
