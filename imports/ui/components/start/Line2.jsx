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

    this.state = {
      age1: '',
      age2: '',
    };

    this.handleChange1 = this.handleChange1.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
  }


  handleChange1(event) {
    this.setState({
      age1: event.target.value.substring(0, 2), // Allow only 2 characters
    }, function () {
      this.setGender();
      this.setCompleted();
    }.bind(this));
  }

  handleChange2(event) {
    this.setState({
      age2: event.target.value.substring(0, 2), // Allow only 2 characters
    }, function () {
      this.setGender();
      this.setCompleted();
    }.bind(this));
  }

  setCompleted() {
    // For code readability
    const a1 = this.state.age1;
    const a2 = this.state.age2;

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
    const a1 = Number(this.state.age1);
    const a2 = Number(this.state.age2);

    if (a1 >= 51 || a2 >= 51) {
      this.props.setGenderRequired(true);
    } else {
      this.props.setGenderRequired(false);
    }
  }

  render() {
    return (
      <article onClick={this.props.setStep}>
        <h1 className={this.props.classes.text}>
          {this.props.twoBuyers ? 'et nous avons' : 'et j\'ai'}
          <TextField
            style={styles.textField}
            name="age1"
            value={this.state.age1}
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
              value={this.state.age2}
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
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  step: PropTypes.number.isRequired,
  twoBuyers: PropTypes.bool.isRequired,
  setStep: PropTypes.func.isRequired,
  completeStep: PropTypes.func.isRequired,
  setGenderRequired: PropTypes.func.isRequired,
};
