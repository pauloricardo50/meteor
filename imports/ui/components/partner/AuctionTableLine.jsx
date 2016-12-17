import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';


import RaisedButton from 'material-ui/RaisedButton';

import { toMoney } from '/imports/js/finance-math.js';

var time;

export default class AuctionTableLine extends Component {
  constructor(props) {
    super(props);

    this.state = {
      remainingTime: '',
    };

    this.handleClick = this.handleClick.bind(this);
    this.setRemainingTime = this.setRemainingTime.bind(this);
  }

  componentDidMount() {
    // Do it once the component loads
    this.setRemainingTime();

    // Repeat every second
    this.interval = Meteor.setInterval(this.setRemainingTime, 1000);
  }

  componentWillUnmount() {
    Meteor.clearInterval(this.interval);
  }

  setRemainingTime() {
    const endDate = moment(this.props.auction.auctionEndTime);
    // Get the time difference between the end and current time with moment()
    const difference = moment.duration(endDate.diff(moment()), 'milliseconds');
    // Get the minutes and seconds to display using moment-duration-format,
    // and trim the hours and days,
    // trim: false lets the hours and minutes to 00:00 instead of trimming them off
    const minSec = difference.format('dd:hh:mm:ss', { trim: false }).slice(5);
    // Get the hours
    const hours = Math.floor(difference.asHours());

    // Concatenate both and set state
    this.setState({
      remainingTime: `${hours}${minSec}`,
    });
  }

  handleClick() {
    FlowRouter.go(`/partner/${this.props.auction._id}`);
  }

  render() {
    return (
      <tr>
        <td className="left-align">{this.state.remainingTime}</td>
        <td className="left-align">{this.props.auction.type}</td>
        <td className="right-align">{`CHF ${toMoney(this.props.auction.value)}`}</td>
        <td className="right-align">
          <RaisedButton
            label="Faire une Offre"
            primary
            onClick={this.handleClick}
          />
        </td>
      </tr>
    );
  }
}

AuctionTableLine.propTypes = {
  auction: PropTypes.objectOf(PropTypes.any).isRequired,
};
