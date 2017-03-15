import React, { Component, PropTypes } from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import CallSplit from 'material-ui/svg-icons/communication/call-split';
import PieChart from 'material-ui/svg-icons/editor/pie-chart';
import Badge from 'material-ui/Badge';

import FinanceWidget from '/imports/ui/components/general/FinanceWidget.jsx';
import ProjectChart from '/imports/ui/components/charts/ProjectChart.jsx';
import SideNavFinance from '/imports/ui/components/general/SideNavFinance.jsx';

import { strategiesChosen } from '/imports/js/requestFunctions';

const styles = {
  icon: {
    padding: 20,
  },
  text: {
    display: 'inline',
    fontSize: '1em',
  },
  link: {
    display: 'block',
  },
  logo: {
    maxHeight: 25,
    paddingLeft: 20,
    paddingRight: 20,
  },
  chartMask: {
    paddingLeft: 0,
    paddingRight: 0,
  },
};

export default class SideNav extends Component {
  constructor(props) {
    super(props);

    this.state = {
      requestName: '',
      propertyValue: '',
    };
    if (this.props.loanRequest) {
      this.state = {
        requestName: this.props.loanRequest.property.address1,
        propertyValue: this.props.loanRequest.property.value,
      };
    }
  }

  componentWillReceiveProps(nextProps) {
    const r = nextProps.loanRequest;
    let requestName = '';
    if (r && r.property) {
      requestName = r.property.address1;
    }
    // Only update if the value exists and is new
    if (r && requestName && requestName !== this.state.requestName) {
      this.setState({ requestName });
    }
    if (r && r.property && r.property.value) {
      if (r.property.value !== this.state.propertyValue) {
        this.setState({ propertyValue: r.property.value });
      }
    }
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.currentURL !== nextProps.currentURL) {
      return true;
    }
    return true;
  }

  getStrategyNotification() {
    const r = this.props.loanRequest;
    let value = 0;

    if (!r.logic.hasValidatedCashStrategy) {
      value += 1;
    }
    if (r.logic.step > 1) {
      if (!r.logic.loanStrategyPreset) {
        value += 1;
      }
      if (!r.logic.amortizingStrategyPreset) {
        value += 1;
      }
    }

    return value;
  }

  render() {
    // Don't display any content if there is no active LoanRequest
    let content1;
    let content2;
    if (this.props.loanRequest) {
      content1 = (
        <ul className="side-nav-list">
          <li>
            <a
              href="/main"
              className={
                (this.props.currentURL === '/main' ||
                  this.props.currentURL.substring(0, 5) === '/step') &&
                  'active-link'
              }
            >
              <span className="icon fa fa-home fa-2x" />
              <h5>{this.state.requestName}</h5>
            </a>
          </li>
          <li>
            <a
              href="/strategy"
              className={
                this.props.currentURL.substring(0, 9) === '/strategy' &&
                  'active-link'
              }
            >
              <span className="icon"><CallSplit /></span>
              {this.getStrategyNotification()
                ? <Badge
                    badgeContent={this.getStrategyNotification()}
                    primary
                    badgeStyle={{ top: 'calc(50% - 12px)', right: -40 }}
                    style={{ display: 'inline-flex', padding: 0 }}
                  >
                    <h5>Stratégies</h5>
                  </Badge>
                : <h5>
                    Stratégies&nbsp;&nbsp;
                    {strategiesChosen(this.props.loanRequest) &&
                      <span className="fa fa-check success" />}
                  </h5>}
            </a>
          </li>
          <li>
            <a
              href="/finance"
              className={this.props.currentURL === '/finance' && 'active-link'}
            >
              <span className="icon fa fa-pie-chart fa-2x" />
              <h5>Finances</h5>
            </a>
          </li>
        </ul>
      );

      content2 = <SideNavFinance loanRequest={this.props.loanRequest} />;
      // content2 = this.props.currentURL !== '/finance' &&
      //   (<article className="mask1 finance-widget" style={styles.chartMask}>
      //     <ProjectChart
      //       horizontal={false}
      //       name={this.props.loanRequest.property.address1}
      //       propertyValue={this.props.loanRequest.property.value}
      //       fortuneUsed={this.props.loanRequest.general.fortuneUsed}
      //       insuranceFortuneUsed={this.props.loanRequest.general.insuranceFortuneUsed}
      //     />
      //     <div className="text-center">
      //       <RaisedButton
      //         href="/finance"
      //         label="Modifier"
      //         primary
      //         style={styles.button}
      //       />
      //     </div>
      //   </article>
      // );
    } else {
      // If the user is not on the main page, show a link to it
      content1 = this.props.currentURL !== '/main'
        ? <a href="/main" className="side-nav-link">
            <h3 className="bold active text-center">Commencer</h3>
          </a>
        : null;
      content2 = null;
    }

    // Show an empty sidenav when the user is on the new page
    const isNew = this.props.currentURL.substring(0, 4) === '/new';

    return (
      <nav className="side-nav hidden-xs">

        <a href="/">
          <img src="/img/logo_black.svg" alt="e-Potek" style={styles.logo} />
        </a>

        {!isNew && content1}
        {!isNew && content2}

      </nav>
    );
  }
}

SideNav.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any),
  currentURL: PropTypes.string.isRequired,
};
