import React, { PropTypes } from 'react';

import { getRatio } from '/imports/js/finance-math';

const styles = {
  titles: {
    margin: 0,
  },
};

export default class Ratio extends React.Component {
  constructor(props) {
    super(props);
  }

  getRatioRating(ratio) {
    if (ratio >= 0.35) {
      return 'trop élevé';
    } else if (ratio >= 0.3) {
      return 'bon';
    } else if (ratio >= 0.2) {
      return 'très bon';
    } else if (ratio >= 0.05) {
      return 'excellent';
    }

    return 'Bill Gates';
  }

  render() {
    const ratio = getRatio(this.props.loanRequest);

    return (
      <div>
        <h4 style={styles.titles} className="secondary">
          <span>Ratio d'endettement - </span>
          <span
            className={
              ratio >= 0.35 ? 'normal bold error' : 'normal bold success'
            }
          >
            {this.getRatioRating(ratio)}
          </span>
        </h4>
        <h1 className="display1" style={styles.titles}>
          {Math.round(ratio * 1000) / 10}%
        </h1>
      </div>
    );
  }
}

Ratio.propTypes = {
  loanRequest: React.PropTypes.objectOf(React.PropTypes.any),
};
