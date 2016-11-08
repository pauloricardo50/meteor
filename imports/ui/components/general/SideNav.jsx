import React, { Component, PropTypes } from 'react';

import FinanceWidget from '/imports/ui/components/general/FinanceWidget.jsx';

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

  toMoney(value) {
    return String(value).replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  }


  render() {
    // Don't display any content if there is no active CreditRequest
    let content1;
    let content2;
    if (this.props.creditRequest) {
      content1 = (
        <a href="/main">
          <ul>
            <li><h5 className="active bold"><span className="fa fa-home active" /> {this.state.requestName}</h5></li>
            {this.state.propertyValue ? (<li className="secondary">CHF {this.toMoney(this.state.propertyValue)}</li>) : null}
          </ul>
        </a>
      );
      content2 = <FinanceWidget creditRequest={this.props.creditRequest} />;
    } else {
      content1 = (
        <a href="/main">
          <h3 className="bold active start-nav text-center">Commencer</h3>
        </a>
      );
      content2 = null;
    }

    return (
      <nav className="side-nav hidden-xs">

        <a href="/">
          <img src="img/logo_black.svg" alt="e-Potek" width="160px" style={{ paddingLeft: 20, paddingRight: 20 }} />
        </a>

        {content1}
        {content2}

      </nav>
    );
  }
}

SideNav.propTypes = {
  creditRequest: PropTypes.objectOf(PropTypes.any),
};
