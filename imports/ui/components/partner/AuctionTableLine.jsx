import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';

import RaisedButton from 'material-ui/RaisedButton';

import { toMoney } from '/imports/js/conversionFunctions';
import Countdown from '/imports/ui/components/general/Countdown.jsx';

export default class AuctionTableLine extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.offerExists = this.offerExists.bind(this);
  }

  handleClick() {
    FlowRouter.go(`/partner/${this.props.auction._id}`);
  }

  offerExists() {
    let exists = false;
    this.props.offers.forEach((offer, index) => {
      if (this.props.auction._id === offer.requestId) {
        exists = true;
        return true;
      }
    });

    return exists;
  }

  render() {
    return (
      <tr>
        <td className="left-align">
          <Countdown endTime={this.props.auction.auctionEndTime} />
        </td>
        <td className="left-align">{this.props.auction.type}</td>
        <td className="right-align">
          {`CHF ${toMoney(this.props.auction.value)}`}
        </td>
        <td className="right-align">
          {this.offerExists()
            ? <RaisedButton
                label="Modifier mon offre"
                onTouchTap={this.handleClick}
              />
            : <RaisedButton
                label="Faire une offre"
                primary
                onTouchTap={this.handleClick}
              />}
        </td>
      </tr>
    );
  }
}

AuctionTableLine.propTypes = {
  auction: PropTypes.objectOf(PropTypes.any).isRequired,
  offers: PropTypes.arrayOf(PropTypes.object),
};
