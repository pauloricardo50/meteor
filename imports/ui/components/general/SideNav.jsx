import React, { Component, PropTypes } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';

import FinanceWidget from '/imports/ui/components/general/FinanceWidget.jsx';
import SideChart from '/imports/ui/components/charts/SideChart.jsx';

const styles = {
  icon: {
    paddingRight: 10,
  },
  text: {
    display: 'inline',
    fontSize: '1em',
  },
  main: {
    padding: 30,
  },
  logo: {
    // width: 160,
    paddingLeft: 20,
    paddingRight: 20,
  },
};

export default class SideNav extends Component {
  constructor(props) {
    super(props);

    this.state = {
      requestName: '',
      propertyValue: '',
    };
    if (this.props.creditRequest) {
      this.state = {
        requestName: this.props.creditRequest.requestName,
        propertyValue: this.props.creditRequest.propertyInfo.value,
      };
    }
  }

  componentWillReceiveProps(nextProps) {
    const r = nextProps.creditRequest;
    // Only update if the value exists and is new
    if (r) {
      if (r.requestName) {
        if (r.requestName !== this.state.requestName) {
          this.setState({ requestName: r.requestName });
        }
      }
      if (r.propertyInfo && r.propertyInfo.value) {
        if (r.propertyInfo.value !== this.state.propertyValue) {
          this.setState({ propertyValue: r.propertyInfo.value });
        }
      }
    }
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.currentURL !== nextProps.currentURL) {
      return true;
    }
    return true;
  }


  toMoney(value) {
    return String(value).replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  }


  render() {
    // Don't display any content if there is no active CreditRequest
    let content1;
    let content2;
    if (this.props.creditRequest) {
      content1 = (
        <a href="/main" style={styles.main}>
          <span className="fa fa-home fa-2x active" style={styles.icon} />
          <h5 className="active bold" style={styles.text}>{this.state.requestName}</h5>
        </a>
      );

      // content2 = <FinanceWidget creditRequest={this.props.creditRequest} />;
      content2 = this.props.currentURL !== '/finance' &&
        <SideChart creditRequest={this.props.creditRequest} />;

    } else {
      // If the user is not on the main page, show a link to it
      content1 = (
        this.props.currentURL !== '/main' ?
        <a href="/main">
          <h3 className="bold active start-nav text-center">Commencer</h3>
        </a> :
        null
        );
      content2 = null;
    }

    return (
      <nav className="side-nav hidden-xs">

        <a href="/">
          <img src="img/logo_black.svg" alt="e-Potek" width="160px" style={styles.logo} />
        </a>

        {content1}
        {content2}

      </nav>
    );
  }
}

SideNav.propTypes = {
  creditRequest: PropTypes.objectOf(PropTypes.any),
  currentURL: PropTypes.string.isRequired,
};
