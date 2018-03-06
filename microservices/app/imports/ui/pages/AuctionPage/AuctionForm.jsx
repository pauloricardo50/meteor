import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import AutoForm from 'core/components/AutoForm';
import { constants } from 'core/api';

import { getAuctionEndTime } from 'core/utils/loanFunctions';
import cleanMethod from 'core/api/cleanMethods';

// Min closing date can be 2 days after auction ends
const getMinDate = serverTime =>
  moment(getAuctionEndTime(serverTime))
    .add(2, 'd')
    .toDate();

const getFormArray = (loan, serverTime) => [
  {
    type: 'h3',
    text: 'Derniers réglages',
    id: 'auction.formTitle',
  },
  {
    id: 'general.wantedClosingDate',
    type: 'dateInput',
    minDate: getMinDate(serverTime),
    openDirection: 'up',
  },
  {
    id: 'general.auctionMostImportant',
    type: 'selectFieldInput',
    options: Object.values(constants.AUCTION_MOST_IMPORTANT),
  },
];

export default class AuctionForm extends Component {
  constructor(props) {
    super(props);

    const date = this.props.loan.general.wantedClosingDate;

    if (date && date < getMinDate(this.props.serverTime)) {
      const object = {
        'general.wantedClosingDate': '',
      };
      cleanMethod('updateLoan', { object, id: this.props.loan._id });
    }
  }

  render() {
    return (
      <AutoForm
        inputs={getFormArray(this.props.loan, this.props.serverTime)}
        formClasses="user-form"
        docId={this.props.loan._id}
        updateFunc="updateLoan"
        pushFunc="pushLoanValue"
        popFunc="popLoanValue"
        doc={this.props.loan}
      />
    );
  }
}

AuctionForm.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
  serverTime: PropTypes.object.isRequired,
};
