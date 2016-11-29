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


export default class Line4 extends Component {
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
      p.propertyType !== n.propertyType ||
      p.isNewPurchase !== n.isNewPurchase
    );
  }


  changeState(event, i) {
    this.props.completeStep(event, true);

    switch (i) {
      case 1:
        this.props.setStateValue('propertyType', 'primary');
        this.setState({ text: ' une résidence principale.' });
        break;
      case 2:
        this.props.setStateValue('propertyType', 'secondary');
        this.setState({ text: ' une résidence secondaire.' });
        break;
      case 3:
        this.props.setStateValue('propertyType', 'investment');
        this.setState({ text: ' un investissement.' });
        break;
      default: break;
    }
  }

  render() {
    return (
      <article onClick={this.props.setStep}>

        <h1 className={this.props.classes.text}>
          et la propriété
          {this.props.isNewPurchase ? ' sera ' : ' est '}
          utilisée comme
          {this.state.text}
        </h1>

        {this.props.step === this.props.index &&
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
              style={styles.button}
              primary={!this.state.text}
              onClick={e => this.changeState(e, 3)}
            />
          </div>
        }

      </article>
    );
  }
}

Line4.propTypes = {
  step: PropTypes.number.isRequired,
  setStep: PropTypes.func.isRequired,
  setStateValue: PropTypes.func.isRequired,
  completeStep: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  index: PropTypes.number.isRequired,

  propertyType: PropTypes.string.isRequired,
  isNewPurchase: PropTypes.bool.isRequired,
};
