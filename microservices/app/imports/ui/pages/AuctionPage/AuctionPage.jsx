import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

import { LoadingComponent } from 'core/components/Loading';

import ProcessPage from '/imports/ui/components/ProcessPage';
import AuctionStart from './AuctionStart';
import Auction from './Auction';
import AuctionResults from './AuctionResults';

let time;

export default class AuctionPage extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    // Call it once initially
    const getTime = () =>
      Meteor.call('getServerTime', (e, res) => {
        if (e) {
          console.log(e);
        } else {
          this.setState({ serverTime: res });
        }
      });

    getTime();

    time = Meteor.setInterval(getTime, 1000);
  }

  componentWillUnmount() {
    Meteor.clearInterval(time);
  }

  getContent() {
    const { loanRequest, offers, borrowers, history } = this.props;
    const { serverTime } = this.state;

    if (!serverTime) {
      return (
        <div style={{ height: 150 }}>
          <LoadingComponent />
        </div>
      );
    }

    if (
      loanRequest.logic.auction.endTime <=
        serverTime.setSeconds(serverTime.getSeconds() + 1) ||
      loanRequest.logic.auction.status === 'ended'
    ) {
      // After the auction, clear interval
      Meteor.clearInterval(time);

      return <AuctionResults loanRequest={loanRequest} offers={offers} />;
    } else if (loanRequest.logic.auction.status === 'started') {
      // During the auction
      return <Auction loanRequest={loanRequest} offers={offers} />;
    }
    // Before the auction, lets the user start it
    return (
      <AuctionStart
        loanRequest={loanRequest}
        borrowers={borrowers}
        history={history}
        serverTime={serverTime}
      />
    );
  }

  render() {
    const { serverTime } = this.state;

    return (
      <ProcessPage
        {...this.props}
        stepNb={2}
        id="auction"
        serverTime={serverTime}
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
