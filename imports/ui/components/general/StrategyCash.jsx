import React, { Component, PropTypes } from 'react';


import StrategyCashTable from './StrategyCashTable.jsx';
import StrategyCashMetrics from './StrategyCashMetrics.jsx';

const styles = {
  ratioDiv: {
    margin: '40px 0',
  },
};

export default class StrategyCash extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    return (
      <section>
        <h2>Ma Stratégie de Fonds Propres</h2>

        <StrategyCashMetrics loanRequest={this.props.loanRequest} />

        <StrategyCashTable loanRequest={this.props.loanRequest} />

      </section>
    );
  }
}

StrategyCash.propTypes = {
  loanRequest: React.PropTypes.objectOf(React.PropTypes.any),
};
