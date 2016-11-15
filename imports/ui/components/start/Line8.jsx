import React, { Component, PropTypes } from 'react';


import RaisedButton from 'material-ui/RaisedButton';
import Line8Help from './Line8Help.jsx';

const styles = {
  button: {
    marginRight: 8,
    marginBottom: 8,
  },
  extra: {
    marginBottom: 20,
  },
};


export default class Line8 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
    };

    this.changeState = this.changeState.bind(this);
  }

  changeState(e, maxCash) {
    this.props.completeStep(e, true);

    if (maxCash) {
      this.setState({
        text: 'un max de fonds propres',
      });
    } else {
      this.setState({
        text: 'un max de 2ème pilier',
      });
    }
  }

  render() {
    return (
      <article onClick={this.props.setStep}>

        <h1 className={this.props.classes.text}>
          {this.props.twoBuyers ? 'Nous voulons utiliser ' : 'Je veux utiliser '}
          {this.state.text}
        </h1>

        {this.props.step === 7 ?
          <div className={this.props.classes.extra} style={styles.extra}>
            <RaisedButton
              label="Un max de fonds propres"
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
            <br />
            <Line8Help />
          </div>
          : ''
        }

      </article>
    );
  }
}

Line8.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  step: PropTypes.number.isRequired,
  twoBuyers: PropTypes.bool.isRequired,
  setStep: PropTypes.func.isRequired,
  completeStep: PropTypes.func.isRequired,
};
