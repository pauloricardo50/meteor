import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

import TextField from 'material-ui/TextField';
import MaskedInput from 'react-text-mask';

import { toNumber } from '/imports/js/conversionFunctions';
import { moneyValidation } from '/imports/js/validation';
import { swissFrancMask } from '/imports/js/textMasks';


const styles = {
  textField: {
    width: 185,
    fontSize: 'inherit',
    marginLeft: 8,
    marginRight: 8,
  },
};

var timer;

export default class IncomeLine extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: '',
    };

    this.handleChange = this.handleChange.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const p = this.props;
    const n = nextProps;

    return (
      p.classes !== n.classes ||
      p.twoBuyers !== n.twoBuyers ||
      p.salary !== n.salary
    );
  }


  setCompleted() {
    if (this.props.salary) {
      this.props.completeStep(null, true, true);
    }
  }


  handleChange(event, noTimeout) {
    event.preventDefault();
    Meteor.clearTimeout(timer);

    this.props.setStateValue(
      'salary',
      String(toNumber(event.target.value)),
      () => {
        // Use a quick timeout to allow user to type in more stuff before going to next step
        if (this.validate()) {
          timer = Meteor.setTimeout(() => {
            this.setCompleted();
          }, noTimeout ? 0 : this.props.timeout);
        }
      },
    );
  }


  validate() {
    const errors = moneyValidation(this.props.salary);

    this.setState({
      error: errors[0],
    }, () => {
      // If an error exists, set valid to false
      if (this.state.error) {
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
          Le total de
          {this.props.twoBuyers ? ' nos ' : ' mes '}
          revenus brut est de
          <span className="value">
            <TextField
              style={styles.textField}
              name="salary"
              value={this.props.salary}
              onChange={e => this.handleChange(e, false)}
              onBlur={e => this.handleChange(e, true)}
              errorText={this.state.error ? ' ' : ''}
              ref={(c) => { this.value = c; }}
            >
              <MaskedInput
                mask={swissFrancMask}
                guide
                placeholder="CHF"
                autoFocus
                pattern="[0-9]*"
              />
            </TextField>
          </span>
          par an,
        </h1>
        <h4 className={this.props.classes.errorText}>{this.state.error}</h4>
      </article>
    );
  }
}

IncomeLine.propTypes = {
  step: PropTypes.number.isRequired,
  setStep: PropTypes.func.isRequired,
  setStateValue: PropTypes.func.isRequired,
  setValid: PropTypes.func.isRequired,
  completeStep: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.string).isRequired,

  twoBuyers: PropTypes.bool.isRequired,
  salary: PropTypes.string.isRequired,
  timeout: PropTypes.number.isRequired,
};
