import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

import TextField from 'material-ui/TextField';

import { toMoney, toNumber } from '/imports/js/finance-math.js';

const styles = {
  textField: {
    width: 150,
    fontSize: 'inherit',
    marginLeft: 8,
    marginRight: 8,
  },
};

var timer;

export default class Line8b extends Component {
  constructor(props) {
    super(props);

    this.handleFortuneChange = this.handleFortuneChange.bind(this);
    this.handleInsuranceFortuneChange = this.handleInsuranceFortuneChange.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const p = this.props;
    const n = nextProps;

    return (
      p.classes !== n.classes ||
      p.twoBuyers !== n.twoBuyers ||
      p.fortune !== n.fortune ||
      p.insuranceFortune !== n.insuranceFortune
    );
  }


  setCompleted() {
    if (this.props.insuranceFortune) {
      this.props.completeStep(null, true);
    }
  }


  handleFortuneChange(event) {
    Meteor.clearTimeout(timer);

    this.props.setStateValue('fortune', String(toNumber(event.target.value)));
  }

  handleInsuranceFortuneChange(event) {
    Meteor.clearTimeout(timer);

    this.props.setStateValue(
      'insuranceFortune',
      String(toNumber(event.target.value)),
      () => {
        // Use a quick timeout to allow user to type in more stuff before going to next step
        timer = Meteor.setTimeout(() => {
          this.setCompleted();
        }, 400);
      }
    );
  }


  render() {
    return (
      <article onClick={this.props.setStep}>
        <h1 className={this.props.classes.text}>

          <span>
            {this.props.twoBuyers ? 'mais nous avons ' : 'mais j\'ai '}
            à disposition
            <TextField
              style={styles.textField}
              name="fortune"
              value={`CHF ${toMoney(this.props.fortune)}`}
              onChange={this.handleFortuneChange}
              pattern="[0-9]*"
              autoFocus
            />
            de fortune personelle
          </span>
          {/* Once some bit of fortune has been entered, show the rest of the sentence */}
          {this.props.fortune &&
            <span>
              &nbsp;et
              <TextField
                style={styles.textField}
                name="insuranceFortune"
                value={`CHF ${toMoney(this.props.insuranceFortune)}`}
                onChange={this.handleInsuranceFortuneChange}
                pattern="[0-9]*"
              />
              de 2ème pilier.
            </span>
          }
        </h1>
      </article>
    );
  }
}

Line8b.propTypes = {
  step: PropTypes.number.isRequired,
  setStep: PropTypes.func.isRequired,
  setStateValue: PropTypes.func.isRequired,
  completeStep: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.string).isRequired,

  twoBuyers: PropTypes.bool.isRequired,
  fortune: PropTypes.string.isRequired,
  insuranceFortune: PropTypes.string.isRequired,
};
