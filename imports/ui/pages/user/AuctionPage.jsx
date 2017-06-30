import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

import { LoadingComponent } from '/imports/ui/components/general/Loading.jsx';

import ProcessPage from '/imports/ui/components/general/ProcessPage.jsx';
import AuctionStart from './auctionPage/AuctionStart.jsx';
import Auction from './auctionPage/Auction.jsx';
import AuctionResults from './auctionPage/AuctionResults.jsx';

let time;

export default class AuctionPage extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    // Call it once initially
    Meteor.call('getServerTime', (e, res) => {
      this.setState({
        serverTime: res,
      });
    });

    time = Meteor.setInterval(() => {
      // Call it again every second
      Meteor.call('getServerTime', (e, res) => {
        this.setState({
          serverTime: res,
        });
      });
    }, 1000);
  }

  componentWillUnmount() {
    Meteor.clearInterval(time);
  }

  getContent() {
    if (!this.state.serverTime) {
      return (
        <div style={{ height: 150 }}>
          <LoadingComponent />
        </div>
      );
    }

    if (
      this.props.loanRequest.logic.auctionEndTime <=
      this.state.serverTime.setSeconds(this.state.serverTime.getSeconds() + 1)
    ) {
      // After the auction, clear interval
      Meteor.clearInterval(time);

      return (
        <AuctionResults
          loanRequest={this.props.loanRequest}
          offers={this.props.offers}
        />
      );
    } else if (this.props.loanRequest.logic.auctionStarted) {
      // During the auction
      return (
        <Auction
          loanRequest={this.props.loanRequest}
          offers={this.props.offers}
        />
      );
    }
    // Before the auction, lets the user start it
    return (
      <AuctionStart
        loanRequest={this.props.loanRequest}
        borrowers={this.props.borrowers}
        history={this.props.history}
        serverTime={this.state.serverTime}
      />
    );
  }

  render() {
    return (
      <ProcessPage
        {...this.props}
        stepNb={2}
        id="auction"
        serverTime={this.state.serverTime}
        showBottom={false}
      >
        {this.getContent()}
      </ProcessPage>
    );
  }
}

AuctionPage.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
  offers: PropTypes.arrayOf(PropTypes.any),
};

AuctionPage.defaultProps = {
  offers: [],
};
