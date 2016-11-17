import React, { Component, PropTypes } from 'react';


import TextField from 'material-ui/TextField';


const styles = {
  textField: {
    width: 30,
    fontSize: 'inherit',
    marginLeft: 8,
    marginRight: 8,
  },
};

export default class Line2 extends Component {
  constructor(props) {
    super(props);

    this.handleChange1 = this.handleChange1.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
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

  handleChange1(event) {
    this.props.setStateValue(
      'age1',
      event.target.value.substring(0, 2),
      () => {
        this.setCompleted();
        this.setGender();
      }
    );
  }
  handleChange2(event) {
    this.props.setStateValue(
      'age2',
      event.target.value.substring(0, 2),
      () => {
        this.setCompleted();
        this.setGender();
      }
    );
  }


  render() {
    return (
      <article onClick={this.props.setStep}>
        <h1 className={this.props.classes.text}>
          {this.props.twoBuyers ? 'et nous avons' : 'et j\'ai'}
          <TextField
            style={styles.textField}
            name="age1"
            value={this.props.age1}
            onChange={this.handleChange1}
            pattern="[0-9]*"
            autoFocus
            ref={(c) => { this.age1 = c; }}
          />
          {this.props.twoBuyers ? 'et' : ''}
          {this.props.twoBuyers ?
            <TextField
              style={styles.textField}
              name="age2"
              value={this.props.age2}
              onChange={this.handleChange2}
              pattern="[0-9]*"
              ref={(c) => { this.age2 = c; }}
            /> :
            null
          }
          ans.
        </h1>
      </article>
    );
  }
}

Line2.propTypes = {
  step: PropTypes.number.isRequired,
  setStep: PropTypes.func.isRequired,
  setStateValue: PropTypes.func.isRequired,
  completeStep: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.string).isRequired,

  twoBuyers: PropTypes.bool.isRequired,
  age1: PropTypes.string.isRequired,
  age2: PropTypes.string.isRequired,
};
