import React, { Component, PropTypes } from 'react';


import RaisedButton from 'material-ui/RaisedButton';


const styles = {
  button: {
    marginRight: 10,
  },
  extra: {
    marginBottom: 20,
  },
};


export default class Line1 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
    };

    this.changeState = this.changeState.bind(this);
  }

  changeState(e, twoBuyers) {
    this.props.setBuyers(twoBuyers);
    this.props.completeStep(e, true);

    if (twoBuyers) {
      this.setState({
        value: 'deux emprunteurs',
      });
    } else {
      this.setState({
        value: 'un emprunteur',
      });
    }
  }

  render() {
    return (
      <article onClick={this.props.setStep}>

        <h1 className={this.props.classes.text}>
          {this.props.twoBuyers ? 'Nous sommes ' : 'Je suis '}
          {this.state.value}
        </h1>

        {this.props.step === 0 ?
          <div className={this.props.classes.extra} style={styles.extra}>
            <RaisedButton
              label="Un emprunteur"
              style={styles.button}
              primary
              onClick={(e) => this.changeState(e, false)}
            />
            <RaisedButton
              label="Deux emprunteurs"
              primary
              onClick={(e) => this.changeState(e, true)}
            />
          </div>
          : ''
        }

      </article>
    );
  }
}

Line1.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  step: PropTypes.number.isRequired,
  twoBuyers: PropTypes.bool.isRequired,
  setStep: PropTypes.func.isRequired,
  completeStep: PropTypes.func.isRequired,
  setBuyers: PropTypes.func.isRequired,
};
