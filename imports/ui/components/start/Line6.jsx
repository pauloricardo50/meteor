import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';


import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import MaskedInput from 'react-text-mask';

import { toNumber } from '/imports/js/finance-math.js';
import { moneyValidation } from '/imports/js/validation.js';
import { swissFrancMask } from '/imports/js/textMasks.js';


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
      error: '',
    };

    this.changeState = this.changeState.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const p = this.props;
    const n = nextProps;

    return (
      p.classes !== n.classes ||
      p.twoBuyers !== n.twoBuyers ||
      p.bonus !== n.bonus ||
      p.bonusExists !== n.bonusExists
    );
  }


  handleChange(event) {
    Meteor.clearTimeout(timer);

    this.props.setStateValue(
      'bonus',
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
        this.props.completeStep(event, true, true);
        break;
      case 2:
        this.props.setStateValue('bonusExists', true);
        this.setState({ bonusSelected: true });
        break;
      default: break;
    }
  }

  validate() {
    const errors = moneyValidation(this.props.bonus);

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

    // The text to show once a bonus option has been selected, based on 1) it exists 2) twoBuyers
    const textAfterSelected = (
      this.props.bonusExists ?
      (this.props.twoBuyers ? 'gagnons' : 'gagne') + ' un bonus annuel moyen de'
      :
      (<span className="value">
        {this.props.twoBuyers ? 'ne gagnons pas de bonus.' : 'ne gagne pas de bonus.'}
      </span>)
    );

    return (
      <article onClick={this.props.setStep}>

        <h1 className={this.props.classes.text}>
          {/* This text is always shown */}
          {this.props.twoBuyers ? 'et nous ' : 'et je '}

          {/* The text constant after the user has chosen an answer */}
          {this.state.bonusSelected ? textAfterSelected : ''}
          {this.props.bonusExists &&
            <span className="value">
              <TextField
                style={styles.textField}
                name="bonus"
                value={this.props.bonus}
                onChange={this.handleChange}
                errorText={this.state.error ? ' ' : ''}
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
          }
        </h1>
        <h4 className={this.props.classes.errorText}>{this.state.error}</h4>


        {/* Display buttons if this is the active step */}
        {this.props.step === this.props.index &&
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
  setValid: PropTypes.func.isRequired,
  completeStep: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  index: PropTypes.number.isRequired,

  twoBuyers: PropTypes.bool.isRequired,
  bonusExists: PropTypes.bool.isRequired,
  bonus: PropTypes.string.isRequired,
  timeout: PropTypes.number.isRequired,
};
