import React, { Component, PropTypes } from 'react';


import RaisedButton from 'material-ui/RaisedButton';
import { minimumFortuneRequired, toMoney } from '/imports/js/finance-math.js';


import HelpModal from './HelpModal.jsx';


const styles = {
  button: {
    marginRight: 8,
    marginBottom: 8,
  },
  extra: {
    marginBottom: 16,
  },
};


export default class Line7_2 extends Component {
  constructor(props) {
    super(props);

    const minFortune = toMoney(minimumFortuneRequired(
      Number(this.props.age1),
      Number(this.props.age2),
      this.props.gender1,
      this.props.gender2,
      this.props.propertyType,
      Number(this.props.salary) + Number(this.props.bonus),
      Number(this.props.propertyValue),
    )[0]);

    this.state = {
      minFortune,
    };

    this.handleClick = this.handleClick.bind(this);
  }


  componentWillReceiveProps(nextProps) {
    const minFortune = toMoney(minimumFortuneRequired(
      Number(nextProps.age1),
      Number(nextProps.age2),
      nextProps.gender1,
      nextProps.gender2,
      nextProps.propertyType,
      Number(nextProps.salary) + Number(nextProps.bonus),
      Number(nextProps.propertyValue),
    )[0]);

    this.setState({
      minFortune,
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const p = this.props;
    const n = nextProps;

    // This component requires a lot of values to calculate the minimum fortune,
    // so just let it always update
    return true;
  }

  handleClick(e) {
    this.props.completeStep(e, true, true);
  }

  render() {
    return (
      <article onClick={this.props.setStep}>

        <h1 className={this.props.classes.text}>
          {this.props.propertyKnown &&
            (this.props.twoBuyers ? 'nous devons ' : 'je dois ')
          }
          {this.props.propertyKnown &&
            <span>
              donc mettre au moins&nbsp;
              <span className="value">CHF {this.state.minFortune}</span>
              &nbsp;en fonds propres.
            </span>
          }
        </h1>

        {this.props.step === this.props.index &&
          <div className={this.props.classes.extra} style={styles.extra}>
            <RaisedButton
              label="Ok"
              style={styles.button}
              primary={!this.state.text}
              onClick={this.handleClick}
            />

            <HelpModal
              buttonLabel="Pourquoi?"
              title="Méthode de Calcul"
              content="Je ne suis pas sûr..."
            />
            <HelpModal
              buttonLabel="Je n'ai pas assez"
              title="Manque de fonds propres"
              content="e-Potek paie la tournée, pas de problème."
            />

          </div>
        }

      </article>
    );
  }
}

Line7_2.propTypes = {
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
  propertyKnown: PropTypes.bool.isRequired,
};
