import React, { Component, PropTypes } from 'react';

import RaisedButton from 'material-ui/RaisedButton';


const types = {
  acquisition: 'une nouvelle acquisition.',
  refinancing: 'refinancer un prêt existant.',
  liquidity: 'obtenir des liquidités.'
};

export default class PurchaseTypeLine extends Component {
  constructor(props) {
    super(props);
  }

  changeState(event, purchaseType) {
    this.props.completeStep(event, true, true);
    this.props.setStateValue('purchaseType', purchaseType);
    this.setState({ text: types[purchaseType] });
  }

  render() {
    return (
      <article onTouchTap={this.props.setStep}>
        <h1 className={this.props.classes.text}>
          Je recherche un prêt hypothécaire pour
          <span className="value">{this.state.text}</span>
        </h1>

        {this.props.step === this.props.index &&
          <div className={this.props.classes.extra} style={styles.extra}>
            <RaisedButton
              label="Une nouvelle acquisition"
              style={this.props.styles.buttons}
              primary={!this.state.text}
              onTouchTap={e => this.changeState(e, 'acquisition')}
            />
            <RaisedButton
              label="Un refinancement"
              style={this.props.styles.buttons}
              primary={!this.state.text}
              onTouchTap={e => this.changeState(e, 'refinancing')}
            />
            <RaisedButton
              label="Obtenir des liquidités"
              style={this.props.styles.buttons}
              primary={!this.state.text}
              onTouchTap={e => this.changeState(e, 'liquidity')}
            />
          </div>
        }
      </article>
    );
  }
}

PurchaseTypeLine.propTypes = {
  step: PropTypes.number.isRequired,
  setStep: PropTypes.func.isRequired,
  setStateValue: PropTypes.func.isRequired,
  completeStep: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
};
