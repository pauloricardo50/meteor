import React, { Component, PropTypes } from 'react';
import { DocHead } from 'meteor/kadira:dochead';

import { Tabs, Tab } from 'material-ui/Tabs';

import StrategyCash from '/imports/ui/components/general/StrategyCash.jsx';
import StrategyLoan from '/imports/ui/components/general/StrategyLoan.jsx';
import StrategyAmortization from '/imports/ui/components/general/StrategyAmortization.jsx';

const styles = {
  section: {
    padding: 0,
    overflow: 'hidden',
  },
  labelSpan: {
    wordWrap: 'normal',
    whiteSpace: 'normal',
    paddingLeft: 4,
    paddingRight: 4,
    width: '100%',
  },
  labelSpan2: {
    wordWrap: 'break-word',
    whiteSpace: 'normal',
    paddingLeft: 4,
    paddingRight: 4,
    width: '100%',
  },
  tabs: {
    paddingRight: 20,
    paddingLeft: 20,
    paddingBottom: 20,
    display: 'inline-block',
    width: '100%',
  },
};

export default class StrategyPage extends Component {
  constructor(props) {
    super(props);

    this.state = { value: 1 };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    DocHead.setTitle('Stratégies - e-Potek');
  }

  handleChange(value) {
    this.setState({ value });
  }

  render() {
    return (
      <section className="mask1 animated fadeIn" style={styles.section}>
        <Tabs
          value={this.state.value}
          onChange={this.handleChange}
        >
          <Tab label={<span style={styles.labelSpan}>Fonds Propres</span>} value={1} >
            <div style={styles.tabs}>
              <StrategyCash loanRequest={this.props.loanRequest} />
            </div>
          </Tab>
          <Tab label={<span style={styles.labelSpan}>Taux</span>} value={2}>
            <div style={styles.tabs}>
              <StrategyLoan loanRequest={this.props.loanRequest} offers={this.props.offers} />
            </div>
          </Tab>
          <Tab label={<span style={styles.labelSpan2}>Amortissement</span>} value={3}>
            <div style={styles.tabs}>
              <StrategyAmortization loanRequest={this.props.loanRequest} offers={this.props.offers} />
            </div>
          </Tab>
        </Tabs>
      </section>
    );
  }
}

StrategyPage.propTypes = {
  loanRequest: React.PropTypes.objectOf(React.PropTypes.any),
  offers: PropTypes.arrayOf(PropTypes.any),
};
