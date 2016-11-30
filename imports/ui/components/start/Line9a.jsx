import React, { Component, PropTypes } from 'react';


import RaisedButton from 'material-ui/RaisedButton';
import { minimumFortuneRequired } from '/imports/js/finance-math.js';

import Line9aHelp from './Line9aHelp.jsx';


const styles = {
  button: {
    marginRight: 8,
    marginBottom: 8,
  },
  extra: {
    marginBottom: 16,
  },
};


export default class Line9a extends Component {
  constructor(props) {
    super(props);

    const minFortune = minimumFortuneRequired(
      Number(this.props.age1),
      Number(this.props.age2),
      this.props.gender1,
      this.props.gender2,
      this.props.propertyType,
      Number(this.props.salary) + Number(this.props.bonus),
      Number(this.props.propertyValue),
    );

    this.state = {
      text: '',
      maxDebtPercent: Math.round(
        100 * ((this.props.propertyValue - minFortune) / this.props.propertyValue)
      ),
    };

    this.changeState = this.changeState.bind(this);
  }


  componentWillReceiveProps(nextProps) {
    const minFortune = minimumFortuneRequired(
      Number(nextProps.age1),
      Number(nextProps.age2),
      nextProps.gender1,
      nextProps.gender2,
      nextProps.propertyType,
      Number(nextProps.salary) + Number(nextProps.bonus),
      Number(nextProps.propertyValue),
    );

    this.setState({
      maxDebtPercent: Math.round(
        100 * ((nextProps.propertyValue - minFortune) / nextProps.propertyValue)
      ),
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const p = this.props;
    const n = nextProps;

    // This component requires a lot of values to calculate the minimum fortune,
    // so just let it always update
    return true;
  }

  changeState(e, maxDebt) {
    this.props.setStateValue('maxDebt', maxDebt);
    this.props.completeStep(e, true);

    if (maxDebt) {
      this.setState({
        text: 'le plus possible.',
      });
    } else {
      this.setState({
        text: 'le moins possible.',
      });
    }
  }

  render() {
    return (
      <article onClick={this.props.setStep}>

        <h1 className={this.props.classes.text}>
          {this.props.twoBuyers ? 'et emprunter ' : 'et emprunter '}
          {this.state.text}
        </h1>

        {this.props.step === this.props.index ?
          <div className={this.props.classes.extra} style={styles.extra}>
            <RaisedButton
              label={`Le plus possible (${this.state.maxDebtPercent}%)`}
              style={styles.button}
              primary={!this.state.text}
              onClick={e => this.changeState(e, true)}
            />
            <RaisedButton
              label="Le moins possible (<65%)"
              style={styles.button}
              primary={!this.state.text}
              onClick={e => this.changeState(e, false)}
            />
            <Line9aHelp buttonStyle={styles.button} />
          </div>
          : ''
        }

      </article>
    );
  }
}

Line9a.propTypes = {
  step: PropTypes.number.isRequired,
  setStep: PropTypes.func.isRequired,
  setStateValue: PropTypes.func.isRequired,
  completeStep: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  index: PropTypes.number.isRequired,

  twoBuyers: PropTypes.bool.isRequired,
  maxDebt: PropTypes.bool.isRequired,

  age1: PropTypes.string.isRequired,
  age2: PropTypes.string.isRequired,
  gender1: PropTypes.string.isRequired,
  gender2: PropTypes.string.isRequired,
  propertyType: PropTypes.string.isRequired,
  salary: PropTypes.string.isRequired,
  bonus: PropTypes.string.isRequired,
  propertyValue: PropTypes.string.isRequired,
};
