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


export default class Line3 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value1: '',
      value2: '',
    };

    this.changeState = this.changeState.bind(this);
  }

  componentDidMount() {
    if (!this.props.genderRequired) {
      this.props.setStep(3);
      this.props.completeStep(null, true);
    }
  }


  changeState(i) {
    switch (i) {
      case 1: this.setState({ value1: 'une femme' }, function () { this.setCompleted(); }.bind(this)); break;
      case 2: this.setState({ value1: 'un homme' }, function () { this.setCompleted(); }.bind(this)); break;
      case 3: this.setState({ value2: 'une femme' }, function () { this.setCompleted(); }.bind(this)); break;
      case 4: this.setState({ value2: 'un homme' }, function () { this.setCompleted(); }.bind(this)); break;
      default: break;
    }
  }

  setCompleted() {
    const s = this.state;

    // If all required values are set, go to next step
    if (this.props.twoBuyers) {
      if (s.value1 && s.value2) {
        this.props.completeStep(null, true);
      }
    } else if (s.value1) {
      this.props.completeStep(null, true);
    }
  }

  render() {
    if (this.props.genderRequired) {
      return (
        <article onClick={this.props.setStep}>

          <h1 className={this.props.classes.text}>
            {this.props.twoBuyers ? 'Nous sommes ' : 'Je suis '}
            {this.state.value1 ? this.state.value1 : '...'}
            {this.props.twoBuyers ? ' et ' : '.'}
            {this.props.twoBuyers ? (this.state.value2 ? this.state.value2 : '...') : ''}
            {this.props.twoBuyers ? ' respectivement.' : ''}
          </h1>

          {this.props.step === 2 ?
            <div className={this.props.classes.extra} style={styles.extra}>
              <RaisedButton
                label="une femme"
                style={styles.button}
                primary
                onClick={() => this.changeState(1)}
              />
              <RaisedButton
                label="un homme"
                style={styles.button}
                primary
                onClick={() => this.changeState(2)}
              />
              <RaisedButton
                label="une femme"
                style={styles.button}
                primary
                onClick={() => this.changeState(3)}
              />
              <RaisedButton
                label="un homme"
                primary
                onClick={() => this.changeState(4)}
              />
            </div>
            : ''
          }

        </article>
      );
    }
    // If gender is not required, return null
    return null;
  }
}

Line3.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  step: PropTypes.number.isRequired,
  twoBuyers: PropTypes.bool.isRequired,
  genderRequired: PropTypes.bool.isRequired,
  setStep: PropTypes.func.isRequired,
  completeStep: PropTypes.func.isRequired,
};
