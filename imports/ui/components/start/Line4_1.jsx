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


export default class Line4_1 extends Component {
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
      p.isNewPurchase !== n.isNewPurchase
    );
  }


  changeState(event, i) {
    this.props.completeStep(event, true);

    switch (i) {
      case 1:
        this.props.setStateValue('isNewPurchase', true);
        this.setState({ text: ' une nouvelle acquisition,' });
        break;
      case 2:
        this.props.setStateValue('isNewPurchase', false);
        this.setState({ text: ' un refinancement,' });
        break;
      default: break;
    }
  }

  render() {
    return (
      <article onClick={this.props.setStep}>

        <h1 className={this.props.classes.text}>
          Ce projet sera
          {this.state.text}
        </h1>

        {this.props.step === this.props.index &&
          <div className={this.props.classes.extra} style={styles.extra}>
            <RaisedButton
              label="Une nouvelle acquisition"
              style={styles.button}
              primary={!this.state.text}
              onClick={e => this.changeState(e, 1)}
            />
            <RaisedButton
              label="Un refinancement"
              style={styles.button}
              primary={!this.state.text}
              onClick={e => this.changeState(e, 2)}
            />
          </div>
        }

      </article>
    );
  }
}

Line4_1.propTypes = {
  step: PropTypes.number.isRequired,
  setStep: PropTypes.func.isRequired,
  setStateValue: PropTypes.func.isRequired,
  completeStep: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.string).isRequired,

  propertyType: PropTypes.string.isRequired,
  isNewPurchase: PropTypes.bool.isRequired,
};
