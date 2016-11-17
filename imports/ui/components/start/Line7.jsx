import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';


import { toMoney, toNumber } from '/imports/js/finance-math.js';


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
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
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
        timer = Meteor.setTimeout(() => {
          this.setCompleted();
        }, 400);
      }
    );
  }


  handleClick(event, value) {
    this.props.setStateValue('propertyKnown', value, true);
    this.props.completeStep(event, true);
  }


  render() {
    const postValue = (
      <span className="animated fadeInRight">
        {this.props.propertyKnown &&
          (this.props.twoBuyers ? ', nous devons ' : ', je dois ')
        }
        {this.props.propertyKnown &&
          `donc mettre au minimum CHF
          ${toMoney(Math.round(this.props.propertyValue * 0.2))} en fonds propres.`
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
              value={`CHF ${toMoney(this.props.propertyValue)}`}
              onChange={this.handleChange}
              pattern="[0-9]*"
              autoFocus={!this.props.bonusExists}
            />
          }
          {this.state.propertyValue ? postValue : null }
        </h1>

        {this.props.step === 6 &&
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
  completeStep: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.string).isRequired,

  twoBuyers: PropTypes.bool.isRequired,
  bonusExists: PropTypes.bool.isRequired,
  propertyKnown: PropTypes.bool.isRequired,
  propertyValue: PropTypes.string.isRequired,
};
