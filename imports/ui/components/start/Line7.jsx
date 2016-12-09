import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import MaskedInput from 'react-text-mask';

import { toMoney, toNumber, minimumFortuneRequired } from '/imports/js/finance-math.js';
import { moneyValidation } from '/imports/js/validation.js';
import { swissFrancMask } from '/imports/js/textMasks.js';


const styles = {
  textField: {
    width: 160,
    fontSize: 'inherit',
    marginLeft: 8,
    marginRight: 8,
  },
};

var timer;

export default class Line7 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasChosen: false,
      error: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const p = this.props;
    const n = nextProps;

    return (
      p.classes !== n.classes ||
      p.twoBuyers !== n.twoBuyers ||
      p.bonusExists !== n.bonusExists ||
      p.propertyKnown !== n.propertyKnown ||
      p.propertyValue !== n.propertyValue
    );
  }


  setCompleted() {
    if (this.props.propertyValue) {
      this.props.completeStep(null, true);
    }
  }


  handleChange(event) {
    Meteor.clearTimeout(timer);

    this.props.setStateValue(
      'propertyValue',
      String(toNumber(event.target.value)),
      () => {
        // Use a quick timeout to allow user to type in more stuff before going to next step
        if (this.validate()) {
          timer = Meteor.setTimeout(() => {
            this.setCompleted();
          }, this.props.timeout);
        }
      }
    );
  }


  handleClick(event, value) {
    this.props.setPropertyKnown(value, true);
    this.props.completeStep(event, true, true);
  }


  validate() {
    const errors = moneyValidation(this.props.propertyValue);

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
    const postValue = (
      <span className="animated fadeInRight">
        {this.props.propertyKnown &&
          (this.props.twoBuyers ? ', nous devons ' : ', je dois ')
        }
        {this.props.propertyKnown &&
          `donc mettre au minimum CHF
          ${toMoney(
            minimumFortuneRequired(
              Number(this.props.age1),
              Number(this.props.age2),
              this.props.gender1,
              this.props.gender2,
              this.props.propertyType,
              Number(this.props.salary) + Number(this.props.bonus),
              Number(this.props.propertyValue),
            )[0]
          )} en fonds propres.`
        }
      </span>);


    return (
      <article onClick={this.props.setStep}>
        <h1 className={this.props.classes.text}>
          {this.props.propertyKnown ?
            'J\'aimerais acheter une propriété qui vaut' : 'Je ne connais pas encore la valeur de la propriété'
          }
          {this.props.propertyKnown &&
            <TextField
              style={styles.textField}
              name="propertyValue"
              value={this.props.propertyValue}
              onChange={this.handleChange}
              errorText={this.state.error ? ' ' : ''}
            >
              <MaskedInput
                mask={swissFrancMask}
                guide
                placeholder="CHF"
                autoFocus={!this.props.bonusExists}
                pattern="[0-9]*"
              />
            </TextField>
          }
          {this.props.propertyValue && postValue}
        </h1>
        <h4 className={this.props.classes.errorText}>{this.state.error}</h4>

        {this.props.step === this.props.index &&
          <div className={this.props.classes.extra} style={styles.extra}>
            {this.props.propertyKnown ?
              <RaisedButton
                label="Je ne sais pas encore"
                style={styles.button}
                primary={!this.state.propertyValue}
                onClick={e => this.handleClick(e, false)}
              />
              :
                <RaisedButton
                  label="En fait, je sais"
                  style={styles.button}
                  primary
                  onClick={e => this.handleClick(e, true)}
                />
            }
          </div>
        }
      </article>
    );
  }
}

Line7.propTypes = {
  step: PropTypes.number.isRequired,
  setStep: PropTypes.func.isRequired,
  setStateValue: PropTypes.func.isRequired,
  setValid: PropTypes.func.isRequired,
  completeStep: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  index: PropTypes.number.isRequired,

  twoBuyers: PropTypes.bool.isRequired,
  bonusExists: PropTypes.bool.isRequired,
  propertyKnown: PropTypes.bool.isRequired,
  setPropertyKnown: PropTypes.func.isRequired,
  propertyValue: PropTypes.string.isRequired,
  timeout: PropTypes.number.isRequired,

  age1: PropTypes.string.isRequired,
  age2: PropTypes.string.isRequired,
  gender1: PropTypes.string.isRequired,
  gender2: PropTypes.string.isRequired,
  propertyType: PropTypes.string.isRequired,
  salary: PropTypes.string.isRequired,
  bonus: PropTypes.string.isRequired,
};
