import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import AutoForm from '/imports/ui/components/general/AutoForm';

import { getAuctionEndTime } from 'core/api/loanrequests/methods';
import cleanMethod from 'core/api/cleanMethods';

// Min closing date can be 2 days after auction ends
const getMinDate = serverTime =>
  moment(getAuctionEndTime(serverTime))
    .add(2, 'd')
    .toDate();

const getFormArray = (request, serverTime) => [
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
    options: ['speed', 'price'],
  },
];

export default class AuctionForm extends Component {
  constructor(props) {
    super(props);

    const date = this.props.loanRequest.general.wantedClosingDate;

    if (date && date < getMinDate(this.props.serverTime)) {
      const object = {
        'general.wantedClosingDate': '',
      };
      cleanMethod('updateRequest', { object, id: this.props.loanRequest._id });
    }
  }

  render() {
    return (
      <AutoForm
        inputs={getFormArray(this.props.loanRequest, this.props.serverTime)}
        formClasses="user-form"
        docId={this.props.loanRequest._id}
        updateFunc="updateRequest"
        pushFunc="pushRequestValue"
        popFunc="popRequestValue"
        doc={this.props.loanRequest}
      />
    );
  }
}

AuctionForm.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  serverTime: PropTypes.object.isRequired,
};
