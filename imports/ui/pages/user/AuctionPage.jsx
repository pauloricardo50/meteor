import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

import Start from './auctionPage/Start.jsx';
import Auction from './auctionPage/Auction.jsx';
import Results from './auctionPage/Results.jsx';

var time;

export default class AuctionPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTime: new Date(),
    };
  }

  componentDidMount() {
    // TODO: Make sure this works in different time zones, currently it probably doesn't
    // Except if timezones are properly accounted for -> to test!
    time = Meteor.setInterval(
      () => {
        this.setState({
          currentTime: new Date(),
        });
      },
      1000,
    );
  }

  componentWillUnmount() {
    Meteor.clearInterval(time);
  }

  getContent() {
    if (
      this.props.loanRequest.logic.auctionEndTime <=
      this.state.currentTime.setSeconds(this.state.currentTime.getSeconds() + 1)
    ) {
      // After the auction
      Meteor.clearInterval(time);

      return (
        <Results
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
      <Start
        loanRequest={this.props.loanRequest}
        borrowers={this.props.borrowers}
      />
    );
  }

  render() {
    return this.getContent();
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
