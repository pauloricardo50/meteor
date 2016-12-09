import React, { Component, PropTypes } from 'react';


import RaisedButton from 'material-ui/RaisedButton';


const styles = {
  button: {
    marginRight: 8,
    marginBottom: 8,
  },
  extra: {
    marginBottom: 16,
  },
};


export default class Line1 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
    };

    this.changeState = this.changeState.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const p = this.props;
    const n = nextProps;

    return (
      p.classes !== n.classes ||
      p.twoBuyers !== n.twoBuyers
    );
  }

  changeState(e, twoBuyers) {
    this.props.setStateValue('twoBuyers', twoBuyers);
    this.props.completeStep(e, true, true);

    if (twoBuyers) {
      this.setState({
        text: 'un couple emprunteur,',
      });
    } else {
      this.setState({
        text: 'un-e emprunteur-se,',
      });
    }
  }

  render() {
    return (
      <article onClick={this.props.setStep}>

        <h1 className={this.props.classes.text}>
          {this.props.twoBuyers ? 'Nous sommes ' : 'Je suis '}
          {this.state.text}
        </h1>

        {this.props.step === this.props.index &&
          <div className={this.props.classes.extra} style={styles.extra}>
            <RaisedButton
              label="Un-e emprunteur-se"
              style={styles.button}
              primary={!this.state.text}
              onClick={e => this.changeState(e, false)}
            />
            <RaisedButton
              label="Un couple emprunteur"
              primary={!this.state.text}
              onClick={e => this.changeState(e, true)}
            />
          </div>
        }

      </article>
    );
  }
}

Line1.propTypes = {
  step: PropTypes.number.isRequired,
  setStep: PropTypes.func.isRequired,
  setStateValue: PropTypes.func.isRequired,
  completeStep: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  index: PropTypes.number.isRequired,

  twoBuyers: PropTypes.bool.isRequired,
};
