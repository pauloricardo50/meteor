import React, { Component, PropTypes } from 'react';

import TextField from 'material-ui/TextField';

import { ageValidation } from '/imports/js/validation';

const styles = {
  textField: {
    width: 30,
    fontSize: 'inherit',
    marginLeft: 8,
    marginRight: 8,
  },
};

export default class AgeLine extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: '',
      error1: '',
      error2: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.validate = this.validate.bind(this);
  }


  shouldComponentUpdate(nextProps, nextState) {
    const p = this.props;
    const n = nextProps;

    return (
      p.classes !== n.classes ||
      p.twoBuyers !== n.twoBuyers ||
      p.age1 !== n.age1 ||
      p.age2 !== n.age2
    );
  }


  setCompleted() {
    // For code readability
    const a1 = this.props.age1;
    const a2 = this.props.age2;

    if (this.props.twoBuyers) {
      if (a1.length >= 2 && a2.length >= 2) {
        this.props.completeStep(null, true);
        // Remove focus form the the textfield after 2 characters are entered
        this.age2.blur();
      } else if (a1.length >= 2 && a2.length === 0) {
        // If only the first one has been completed, set focus to the second input
        this.age2.focus();
      }
    } else if (a1.length >= 2) {
      this.props.completeStep(null, true);
      // Remove focus form the the textfield after 2 characters are entered
      this.age1.blur();
    }
  }


  setGender() {
    // For code readability
    const a1 = this.props.age1;
    const a2 = this.props.age2;

    if (a1 >= 51 || a2 >= 51) {
      this.props.setStateValue('genderRequired', true);
    } else {
      this.props.setStateValue('genderRequired', false);
    }
  }


  handleChange(event, inputNb) {
    const name = `age${inputNb}`;
    this.props.setStateValue(
      name,
      event.target.value.substring(0, 2),
      () => {
        if (this.validate(this.props[name], inputNb)) {
          this.setCompleted();
          this.setGender();
        }
      }
    );
  }


  validate(value, inputNb) {
    const errors = ageValidation(value);
    const key = `error${inputNb}`;
    const object = {};

    // Set an empty space as error to make the input red
    object[key] = errors[0] ? ' ' : '';
    // Set the text value to the error text
    object['error'] = errors[0];

    this.setState(object, () => {
      const s = this.state;
      // If any error exists, set valid to false
      if (s.error || s.error1 || s.error2) {
        this.props.setValid(false);
      } else {
        this.props.setValid(true);
      }
    });
    // Will happen before the setState has finished, return true if there is no error
    return !errors[0];
  }


  render() {
    return (
      <article onTouchTap={this.props.setStep}>
        <h1 className={this.props.classes.text}>
          {this.props.twoBuyers ? 'et nous avons' : 'et j\'ai'}
          <span className="value">
            <TextField
              style={styles.textField}
              name="age1"
              value={this.props.age1}
              onChange={e => this.handleChange(e, 1)}
              pattern="[0-9]*"
              autoFocus
              ref={(c) => { this.age1 = c; }}
              errorText={this.state.error1}
            />
          </span>
          {this.props.twoBuyers ? 'et' : ''}
          {this.props.twoBuyers ?
            <span className="value">
              <TextField
                style={styles.textField}
                name="age2"
                value={this.props.age2}
                onChange={e => this.handleChange(e, 2)}
                pattern="[0-9]*"
                ref={(c) => { this.age2 = c; }}
                errorText={this.state.error2}
              />
            </span> :
            null
          }
          ans.
        </h1>
        <h4 className={this.props.classes.errorText}>{this.state.error}</h4>
      </article>
    );
  }
}

AgeLine.propTypes = {
  step: PropTypes.number.isRequired,
  setStep: PropTypes.func.isRequired,
  setStateValue: PropTypes.func.isRequired,
  setValid: PropTypes.func.isRequired,
  completeStep: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.string).isRequired,

  twoBuyers: PropTypes.bool.isRequired,
  age1: PropTypes.string.isRequired,
  age2: PropTypes.string.isRequired,
};
