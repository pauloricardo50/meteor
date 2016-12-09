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

  shouldComponentUpdate(nextProps, nextState) {
    const p = this.props;
    const n = nextProps;

    return (
      p.classes !== n.classes ||
      p.twoBuyers !== n.twoBuyers ||
      p.maxCash !== n.maxCash
    );
  }

  changeState(e, maxCash) {
    this.props.setStateValue('maxCash', maxCash);
    this.props.completeStep(e, true, true);

    if (maxCash) {
      this.setState({ text: 'un max de fortune' });
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

        {this.props.step === this.props.index &&
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
            <Line8aHelp buttonStyle={styles.button} />
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
  index: PropTypes.number.isRequired,

  twoBuyers: PropTypes.bool.isRequired,
};
