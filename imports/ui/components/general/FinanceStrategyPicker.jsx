import React, { Component, PropTypes } from 'react';

import RaisedButton from 'material-ui/RaisedButton';

import LoanTranche from './LoanTranche.jsx';

const styles = {
  button: {
    marginRight: 8,
  },
};

export default class FinanceStrategyPicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tranches: 1,
    };

    // this.changeTranches = this.changeTranches.bind(this);
  }

  changeTranches(e, difference) {
    // Make sure it never goes below 1
    if (this.state.tranches + difference >= 1) {
      this.setState({
        tranches: this.state.tranches + difference,
      });
    }
  }

  render() {
    const tranchesArray = [];
    for (var i = 0; i < this.state.tranches; i += 1) {
      tranchesArray.push(
        <LoanTranche key={i} />
      );
    }
    return (
      <article>
        <h3>Je veux diviser mon prêt en {this.state.tranches} tranche(s).</h3>
        <RaisedButton
          label="Augmenter"
          onClick={e => this.changeTranches(e, 1)}
          primary
          style={styles.button}
        />
        <RaisedButton
          label="Réduire"
          onClick={e => this.changeTranches(e, -1)}
          disabled={this.state.tranches <= 1}
          primary
          style={styles.button}
        />

        <div className="col-xs-12">
          {tranchesArray}
        </div>

      </article>
    );
  }
}

FinanceStrategyPicker.propTypes = {
  creditRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
