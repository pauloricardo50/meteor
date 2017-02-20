import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { DocHead } from 'meteor/kadira:dochead';


import Step2Start from '/imports/ui/components/steps/Step2Start.jsx';
import Step2Auction from '/imports/ui/components/steps/Step2Auction.jsx';
import Step2AuctionResults from '/imports/ui/components/steps/Step2AuctionResults.jsx';

var time;

export default class Step2Page extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTime: new Date(),
    };
  }

  componentDidMount() {
    DocHead.setTitle('Étape 2 - e-Potek');

    const that = this;

    // TODO: Make sure this works in different time zones, currently it probably doesn't
    // Except if timezones are properly accounted for -> to test!
    time = Meteor.setInterval(function () {
      that.setState({
        currentTime: new Date(),
      });
    }, 1000);
  }

  componentWillUnmount() {
    Meteor.clearInterval(time);
  }

  getContent() {
    if (this.props.loanRequest.logic.auctionEndTime <= this.state.currentTime.setSeconds(this.state.currentTime.getSeconds() + 1)) {
      // After the auction
      Meteor.clearInterval(time);

      return (
        <Step2AuctionResults
          loanRequest={this.props.loanRequest}
          offers={this.props.offers}
        />
      );
    } else if (this.props.loanRequest.logic.auctionStarted) {
      // During the auction
      return (
        <Step2Auction
          loanRequest={this.props.loanRequest}
          offers={this.props.offers}
        />
      );
    }
    // Before the auction, lets the user start it
    return <Step2Start loanRequest={this.props.loanRequest} />;
  }

  render() {
    return (
      <div>
        <h1>2ème Étape <small>Les enchères</small></h1>
        <div className="animated fadeIn">
          {this.getContent()}
        </div>
      </div>
    );
  }
}

Step2Page.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  offers: PropTypes.arrayOf(PropTypes.any),
};
