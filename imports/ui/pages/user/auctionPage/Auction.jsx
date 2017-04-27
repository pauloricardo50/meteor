import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';

import OffersTable from '/imports/ui/components/general/OffersTable.jsx';
import { LoadingComponent } from '/imports/ui/components/general/Loading.jsx';

require('moment-duration-format');

var time;

const styles = {
  p: {
    paddingBottom: 150,
  },
  tableDiv: {
    overflow: 'scroll',
  },
  timer: {
    display: 'inline-block',
    width: '100%',
    margin: '20px 0',
  },
};

export default class Auction extends Component {
  constructor(props) {
    super(props);

    this.state = {
      remainingTime: '00:00:00',
    };
  }

  componentDidMount() {
    const that = this;
    // Call it once before the setInterval so that the timer appears instantly
    this.setTime(that);
    time = Meteor.setInterval(() => {
      that.setTime(that);
    }, 1000);
  }

  componentWillUnmount() {
    Meteor.clearInterval(time);
  }

  setTime(that) {
    const endDate = moment(that.props.loanRequest.logic.auctionEndTime);
    // Get the time difference between the end and current time with moment()
    const difference = moment.duration(endDate.diff(moment()), 'milliseconds');
    // Get the minutes and seconds to display using moment-duration-format,
    // and trim the hours and days,
    // trim: false lets the hours and minutes to 00:00 instead of trimming them off
    const minSec = difference.format('dd:hh:mm:ss', { trim: false }).slice(5);
    // Get the hours
    const hours = Math.floor(difference.asHours());
    // Concatenate both and set the state
    that.setState({
      remainingTime: `${hours}${minSec}`,
    });
  }

  render() {
    return (
      <section className="mask1 animated fadeIn">
        <h2>Enchères en cours..</h2>
        <div className="text-center" style={styles.timer}>
          <h1 className="display3">{this.state.remainingTime}</h1>
        </div>
        <p className="disabled text-center" style={styles.p}>
          Vous recevrez une notification lorsque ce sera terminé
        </p>
        <div style={styles.tableDiv}>
          <OffersTable offers={[]} />
        </div>
        <div>
          <p className="secondary bold text-center animated pulse infinite">
            Bataille des prêteurs en cours
          </p>
          <div style={{ height: 150 }}>
            <LoadingComponent />
          </div>
        </div>
      </section>
    );
  }
}

Auction.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  offers: PropTypes.arrayOf(PropTypes.any),
};
