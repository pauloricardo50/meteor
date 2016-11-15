import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';


import { toMoney, toNumber } from '/imports/js/finance-math.js';


const styles = {
  textField: {
    width: 110,
    fontSize: 'inherit',
  },
};

var timer;

export default class Line7 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      propertyValue: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }


  setCompleted() {
    const s = this.state;
    if (s.propertyValue) {
      this.props.completeStep(null, false);
    }
  }


  handleChange(event) {
    Meteor.clearTimeout(timer);
    this.props.setPropertyValue(Number(toNumber(event.target.value)));

    this.setState({
      propertyValue: toMoney(event.target.value),
    }, function () {
      // Use a quick timeout to allow user to type in more stuff before going to next step
      const that = this;
      timer = Meteor.setTimeout(function () {
        that.setCompleted();
      }, 400);
    });
  }


  handleClick(event, value) {
    this.props.setPropertyKnown(value);
    // If the user clicks on the set True value, do not automatically go to the next step,
    // as he has to enter a property value (though this should never happen the first time due to
    // the default value for propertyKnown)
    this.props.completeStep(event, !value);
  }


  render() {
    return (
      <article onClick={this.props.setStep}>
        <h1 className={this.props.classes.text}>
          {this.props.propertyKnown ?
            'La propriété vaut CHF ' : 'Je ne connais pas encore la valeur de la propriété'
          }
          {this.props.propertyKnown ?
            <TextField
              style={styles.textField}
              name="propertyValue"
              value={this.state.propertyValue}
              onChange={this.handleChange}
            /> : ''
          }
          {this.props.twoBuyers ? ', nous devons ' : ', je dois '}
          {this.props.propertyKnown ?
            `donc mettre au moins CHF
            ${toMoney(Math.round(this.props.propertyValue * 0.2))} en fonds propres` : ''
          }
        </h1>

        {this.props.step === 6 ?
          <div className={this.props.classes.extra} style={styles.extra}>
            {this.props.propertyKnown ?
              <RaisedButton
                label="Je ne sais pas encore"
                style={styles.button}
                primary
                onClick={e => this.handleClick(e, false)}
              /> :
              <RaisedButton
                label="En fait, je sais"
                style={styles.button}
                primary
                onClick={e => this.handleClick(e, true)}
              />
            }
          </div>
          : ''
        }
      </article>
    );
  }
}

Line7.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  step: PropTypes.number.isRequired,
  twoBuyers: PropTypes.bool.isRequired,
  propertyKnown: PropTypes.bool.isRequired,
  propertyValue: PropTypes.number.isRequired,
  setStep: PropTypes.func.isRequired,
  completeStep: PropTypes.func.isRequired,
  setPropertyKnown: PropTypes.func.isRequired,
  setPropertyValue: PropTypes.func.isRequired,
};
