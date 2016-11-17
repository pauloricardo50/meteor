import React, { Component, PropTypes } from 'react';


import RaisedButton from 'material-ui/RaisedButton';
import Line8aHelp from './Line8aHelp.jsx';

const styles = {
  button: {
    marginRight: 8,
    marginBottom: 8,
  },
  extra: {
    marginBottom: 16,
  },
};


export default class Line8a extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
    };

    this.changeState = this.changeState.bind(this);
  }

  changeState(e, maxCash) {
    this.props.setStateValue('maxCash', maxCash);
    this.props.completeStep(e, true);

    if (maxCash) {
      this.setState({ text: 'un max de fonds propres' });
    } else {
      this.setState({ text: 'un max de 2ème pilier' });
    }
  }

  render() {
    return (
      <article onClick={this.props.setStep}>

        <h1 className={this.props.classes.text}>
          {this.props.twoBuyers ? 'Nous voulons utiliser ' : 'Je veux utiliser '}
          {this.state.text}
        </h1>

        {this.props.step === 7 &&
          <div className={this.props.classes.extra} style={styles.extra}>
            <RaisedButton
              label="Un max de fortune"
              style={styles.button}
              primary={!this.state.text}
              onClick={e => this.changeState(e, true)}
            />
            <RaisedButton
              label="Un max de 2ème pilier"
              style={styles.button}
              primary={!this.state.text}
              onClick={e => this.changeState(e, false)}
            />
            <RaisedButton
              label="Je ne sais pas"
              style={styles.button}
              onClick={e => this.changeState(e, true)}
            />
            <br />
            <Line8aHelp />
          </div>
        }

      </article>
    );
  }
}

Line8a.propTypes = {
  step: PropTypes.number.isRequired,
  setStep: PropTypes.func.isRequired,
  setStateValue: PropTypes.func.isRequired,
  completeStep: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.string).isRequired,

  twoBuyers: PropTypes.bool.isRequired,
};
