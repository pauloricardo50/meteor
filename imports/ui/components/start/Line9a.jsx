import React, { Component, PropTypes } from 'react';


import RaisedButton from 'material-ui/RaisedButton';
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

    this.state = {
      text: '',
    };

    this.changeState = this.changeState.bind(this);
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

        {this.props.step === 8 ?
          <div className={this.props.classes.extra} style={styles.extra}>
            <RaisedButton
              label="Le plus possible (80%)"
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
            <br />
            <Line9aHelp />
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

  twoBuyers: PropTypes.bool.isRequired,
  maxDebt: PropTypes.bool.isRequired,
};
