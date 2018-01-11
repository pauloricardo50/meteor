import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import { Meteor } from 'meteor/meteor';

var time;

export default class Countdown extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      remainingTime: '',
    };
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

  setRemainingTime = () => {
    const endDate = moment(this.props.endTime);
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
  };

  render() {
    return (
      <span style={this.props.style} className={this.props.className}>
        {this.state.remainingTime}
      </span>
    );
  }
}

Countdown.propTypes = {
  endTime: PropTypes.objectOf(PropTypes.any).isRequired,
  style: PropTypes.objectOf(PropTypes.any),
  className: PropTypes.string,
};
