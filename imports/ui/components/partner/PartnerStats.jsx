import React, { Component, PropTypes } from 'react';

import CountUp from 'react-countup';

const styles = {
  article: {
    marginTop: 40,
  },
};

export default class PartnerStats extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <article style={styles.article}>
        <div className="col-xs-12 col-sm-4">
          <CountUp
            className="custom-count"
            start={0}
            end={20}
            duration={3.5}
            useEasing
            separator=" "
            decimal=","
            prefix=""
            suffix=""
          />
        </div>
        <div className="col-xs-12 col-sm-4">
          <CountUp
            className="custom-count"
            start={0}
            end={20}
            duration={3.5}
            useEasing
            separator=" "
            decimal=","
            prefix=""
            suffix=""
          />
        </div>
        <div className="col-xs-12 col-sm-4">
          <CountUp
            className="custom-count"
            start={0}
            end={20}
            duration={3.5}
            useEasing
            separator=" "
            decimal=","
            prefix=""
            suffix=""
          />
        </div>
      </article>
    );
  }
}

PartnerStats.propTypes = {};
