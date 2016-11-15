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
      text: '',
      bonus: '',
    };

    this.changeState = this.changeState.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  changeState(event, i) {
    switch (i) {
      case 1:
        this.setState({ text: 'sans bonus.', bonusExists: false });
        this.props.completeStep(event, true);
        break;
      case 2: this.setState({ text: 'avec un bonus annuel moyen de CHF ', bonusExists: true }); break;
      default: break;
    }
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

  render() {
    return (
      <article onClick={this.props.setStep}>

        <h1 className={this.props.classes.text}>
          {this.state.text ? this.state.text : '...'}
          {this.state.bonusExists ?
            <TextField
              style={styles.textField}
              name="bonus"
              value={this.state.bonus}
              onChange={this.handleChange}
              autoFocus
            />
            : ''
          }
          {this.state.bonusExists ? '.' : ''}
          {this.state.bonusExists ? <span className="fa fa-info" /> : ''}
        </h1>

        {this.props.step === 5 ?
          <div className={this.props.classes.extra} style={styles.extra}>
            <RaisedButton
              label="sans bonus"
              style={styles.button}
              primary
              onClick={e => this.changeState(e, 1)}
            />
            <RaisedButton
              label="avec bonus"
              primary
              onClick={e => this.changeState(e, 2)}
            />
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
