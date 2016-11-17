import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';


import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Popover from 'react-bootstrap/lib/Popover';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';

import { toMoney, toNumber } from '/imports/js/finance-math.js';


const styles = {
  button: {
    marginRight: 8,
    marginBottom: 8,
  },
  extra: {
    marginBottom: 16,
  },
  textField: {
    width: 150,
    fontSize: 'inherit',
    marginLeft: 8,
    marginRight: 8,
  },
};

var timer;


export default class Line6 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bonusSelected: false,
    };

    this.changeState = this.changeState.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }


  handleChange(event) {
    Meteor.clearTimeout(timer);

    this.props.setStateValue(
      'bonus',
      String(toNumber(event.target.value)),
      () => {
        // Use a quick timeout to allow user to type in more stuff before going to next step
        timer = Meteor.setTimeout(() => {
          this.setCompleted();
        }, 400);
      }
    );
  }


  setCompleted() {
    if (this.props.bonus) {
      this.props.completeStep(null, true);
    }
  }


  changeState(event, i) {
    switch (i) {
      case 1:
        this.props.setStateValue('bonusExists', false);
        this.setState({ bonusSelected: true });
        this.props.completeStep(event, true);
        break;
      case 2:
        this.props.setStateValue('bonusExists', true);
        this.setState({ bonusSelected: true });
        break;
      default: break;
    }
  }


  render() {

    // The text to show once a bonus option has been selected, based on 1) it exists 2) twoBuyers
    const textAfterSelected = (
      this.props.bonusExists ?
      (this.props.twoBuyers ? 'gagnons' : 'gagne') + ' un bonus annuel moyen de'
      :
      (this.props.twoBuyers ? 'ne gagnons pas de bonus.' : 'ne gagne pas de bonus.')
    );

    return (
      <article onClick={this.props.setStep}>

        <h1 className={this.props.classes.text}>
          {/* This text is always shown */}
          {this.props.twoBuyers ? 'et nous ' : 'et je '}

          {/* The text constant after the user has chosen an answer */}
          {this.state.bonusSelected ? textAfterSelected : ''}
          {this.props.bonusExists &&
            <TextField
              style={styles.textField}
              name="bonus"
              value={`CHF ${toMoney(this.props.bonus)}`}
              onChange={this.handleChange}
              pattern="[0-9]*"
              autoFocus
            />
          }
        </h1>

        {/* Display buttons if this is the active step */}
        {this.props.step === 5 &&
          <div className={this.props.classes.extra} style={styles.extra}>
            {(this.props.bonusExists || !this.state.bonusSelected) &&
              <RaisedButton
                label={this.props.twoBuyers ? 'Ne gagnons pas de bonus' : 'Ne gagne pas de bonus'}
                style={styles.button}
                primary={!this.state.bonusSelected}
                onClick={e => this.changeState(e, 1)}
              />
            }
            {!this.props.bonusExists &&
              <RaisedButton
                label={this.props.twoBuyers ? 'Gagnons un bonus' : 'Gagne un bonus'}
                primary={!this.state.bonusSelected}
                onClick={e => this.changeState(e, 2)}
              />
            }
          </div>
        }
      </article>
    );
  }
}

Line6.propTypes = {
  step: PropTypes.number.isRequired,
  setStep: PropTypes.func.isRequired,
  setStateValue: PropTypes.func.isRequired,
  completeStep: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.string).isRequired,

  twoBuyers: PropTypes.bool.isRequired,
  bonusExists: PropTypes.bool.isRequired,
  bonus: PropTypes.string.isRequired,
};
