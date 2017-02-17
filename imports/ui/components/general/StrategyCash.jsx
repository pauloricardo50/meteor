import React, { Component, PropTypes } from 'react';


import Ratio from './Ratio.jsx';
import StrategyCashTable from './StrategyCashTable.jsx';

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

        <div className="text-center" style={styles.ratioDiv}>
          <Ratio loanRequest={this.props.loanRequest} />
        </div>

        <StrategyCashTable loanRequest={this.props.loanRequest} />

      </section>
    );
  }
}

StrategyCash.propTypes = {
  loanRequest: React.PropTypes.objectOf(React.PropTypes.any),
};
