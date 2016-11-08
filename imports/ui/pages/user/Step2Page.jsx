import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { DocHead } from 'meteor/kadira:dochead';


import Step2Start from '/imports/ui/components/requestSteps/Step2Start.jsx';
import Step2Auction from '/imports/ui/components/requestSteps/Step2Auction.jsx';
import Step2AuctionResults from '/imports/ui/components/requestSteps/Step2AuctionResults.jsx';

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
    time = Meteor.setInterval(function () {
      that.setState({
        currentTime: new Date(),
      });
    }, 1000);
  }

  componentWillUnmount() {
    Meteor.clearInterval(time);
  }

  render() {
    if (this.props.creditRequest.logic.auctionEndTime <= this.state.currentTime) {
      // After the auction
      return <Step2AuctionResults creditRequest={this.props.creditRequest} />;
    } else if (this.props.creditRequest.logic.auctionStarted) {
      // During the auction
      return <Step2Auction creditRequest={this.props.creditRequest} />;
    }
    // Before the auction, lets the user start it
    return <Step2Start requestId={this.props.creditRequest._id} />;
  }
}

Step2Page.propTypes = {
  creditRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
