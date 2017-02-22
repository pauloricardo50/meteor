import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';


import FlatButton from 'material-ui/FlatButton';

import { toMoney } from '/imports/js/conversionFunctions';
import Countdown from '/imports/ui/components/general/Countdown.jsx';


export default class OfferTableLine extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }


  handleClick() {
    // FlowRouter.go(`/partner/${this.props.auction._id}`);
  }


  render() {
    return (
      <tr>
        <td className="left-align">{moment(this.props.offer.auctionEndTime).format('MMM. D, YYYY')}</td>
        <td className="left-align">hehe</td>
        <td className="right-align">haha</td>
        <td className="right-align">
          <FlatButton
            label="Voir l'offre"
            onTouchTap={this.handleClick}
          />
        </td>
      </tr>
    );
  }
}

OfferTableLine.propTypes = {
  offer: PropTypes.objectOf(PropTypes.any).isRequired,
};
