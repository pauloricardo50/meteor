import React, { Component, PropTypes } from 'react';

import FinanceWidget from '/imports/ui/components/general/FinanceWidget.jsx';

export default class SideNav extends Component {
  render() {
    // Don't display any content if there is no active CreditRequest
    let content1;
    let content2;
    if (this.props.creditRequest) {
      content1 = (
        <a href="/main">
          <ul>
            <li><h5 className="active bold"><span className="fa fa-home active" /> {this.props.creditRequest.requestName}</h5></li>
            <li className="secondary">CHF 1'152'000</li>
          </ul>
        </a>
      );
      content2 = <FinanceWidget creditRequest={this.props.creditRequest} />;
    } else {
      content1 = null;
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
