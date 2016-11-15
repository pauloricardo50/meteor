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


export default class Line4 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
    };

    this.changeState = this.changeState.bind(this);
  }

  changeState(event, i) {
    this.props.completeStep(event, true);

    switch (i) {
      case 1: this.setState({ text: ' une résidence principale.' }); break;
      case 2: this.setState({ text: ' une résidence secondaire.' }); break;
      case 3: this.setState({ text: ' un investissement.' }); break;
      default: break;
    }
  }

  render() {
    return (
      <article onClick={this.props.setStep}>

        <h1 className={this.props.classes.text}>
          Cette propriété sera
          {this.state.text}
        </h1>

        {this.props.step === 3 ?
          <div className={this.props.classes.extra} style={styles.extra}>
            <RaisedButton
              label="Une résidence principale"
              style={styles.button}
              primary={!this.state.text}
              onClick={e => this.changeState(e, 1)}
            />
            <RaisedButton
              label="Une résidence Secondaire"
              style={styles.button}
              primary={!this.state.text}
              onClick={e => this.changeState(e, 2)}
            />
            <RaisedButton
              label="Un investissement"
              primary={!this.state.text}
              onClick={e => this.changeState(e, 3)}
            />
          </div>
          : ''
        }

      </article>
    );
  }
}

Line4.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  step: PropTypes.number.isRequired,
  twoBuyers: PropTypes.bool.isRequired,
  setStep: PropTypes.func.isRequired,
  completeStep: PropTypes.func.isRequired,
};
