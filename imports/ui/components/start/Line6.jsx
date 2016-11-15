import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';


import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';


import { toMoney } from '/imports/js/finance-math.js';


const styles = {
  button: {
    marginRight: 10,
  },
  extra: {
    marginBottom: 20,
  },
  textField: {
    width: 100,
    fontSize: 'inherit',
  },
};

var timer;


export default class Line6 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bonusExists: false,
      bonusSelected: false,
      bonus: '',
    };

    this.changeState = this.changeState.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }


  handleChange(event) {
    Meteor.clearTimeout(timer);

    this.setState({
      bonus: toMoney(event.target.value),
    }, function () {
      // Use a quick timeout to allow user to type in more stuff before going to next step
      const that = this;
      timer = Meteor.setTimeout(function () {
        that.setCompleted();
      }, 400);
    });
  }


  setCompleted() {
    const s = this.state;
    if (s.bonus) {
      this.props.completeStep(null, false);
    }
  }


  changeState(event, i) {
    switch (i) {
      case 1:
        this.setState({
          bonusExists: false,
          bonusSelected: true,
        });
        this.props.completeStep(event, true);
        break;
      case 2:
        this.setState({
          bonusExists: true,
          bonusSelected: true,
        });
        break;
      default: break;
    }
  }


  render() {

    // The text to show once a bonus option has been selected, based on 1) it exists 2) twoBuyers
    const textAfterSelected = (
      this.state.bonusExists ?
      (this.props.twoBuyers ? 'gagnons' : 'gagne') + ' un bonus annuel moyen de CHF '
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
          {this.state.bonusExists ?
            <TextField
              style={styles.textField}
              name="bonus"
              value={this.state.bonus}
              onChange={this.handleChange}
              pattern="[0-9]*"
              autoFocus
            />
            : ''
          }
          {/* Final dot to the sentence */}
          {this.state.bonusExists ? '.' : ''}
        </h1>

        {/* Display buttons if this is the active step */}
        {this.props.step === 5 ?
          <div className={this.props.classes.extra} style={styles.extra}>
            {(this.state.bonusExists || !this.state.bonusSelected) ?
              <RaisedButton
                label={this.props.twoBuyers ? 'Ne gagnons pas de bonus' : 'Ne gagne pas de bonus'}
                style={styles.button}
                primary={!this.state.bonusSelected}
                onClick={e => this.changeState(e, 1)}
              /> :
              null
            }
            {!this.state.bonusExists ?
              <RaisedButton
                label={this.props.twoBuyers ? 'Gagnons un bonus' : 'Gagne un bonus'}
                primary={!this.state.bonusSelected}
                onClick={e => this.changeState(e, 2)}
              /> :
              null
            }
          </div>
          : ''
        }
      </article>
    );
  }
}

Line6.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  step: PropTypes.number.isRequired,
  twoBuyers: PropTypes.bool.isRequired,
  setStep: PropTypes.func.isRequired,
  completeStep: PropTypes.func.isRequired,
};
