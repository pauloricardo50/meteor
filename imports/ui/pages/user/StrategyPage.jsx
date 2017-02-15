import React, { Component, PropTypes } from 'react';
import { DocHead } from 'meteor/kadira:dochead';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Tabs, Tab } from 'material-ui/Tabs';

import Money from 'material-ui/svg-icons/editor/attach-money';
import Tune from 'material-ui/svg-icons/image/tune';
import TrendingDown from 'material-ui/svg-icons/action/trending-down';

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

    const initialIndex = Number(FlowRouter.getQueryParam('tab'));

    this.state = { value: initialIndex || 1 };

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
          inkBarStyle={{ background: 'white' }}
        >
          <Tab
            value={1}
            label={<span style={styles.labelSpan}>Fonds Propres</span>}
            icon={<Money />}
          >
            <div style={styles.tabs}>
              <StrategyCash loanRequest={this.props.loanRequest} />
            </div>
          </Tab>
          <Tab
            value={2}
            label={<span style={styles.labelSpan}>Taux</span>}
            icon={<Tune />}
          >
            <div style={styles.tabs}>
              <StrategyLoan loanRequest={this.props.loanRequest} offers={this.props.offers} />
            </div>
          </Tab>
          <Tab
            value={3}
            label={<span style={styles.labelSpan2}>Amortissement</span>}
            icon={<TrendingDown />}
          >
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
