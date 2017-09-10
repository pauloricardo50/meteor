import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import AutoForm from '/imports/ui/components/general/AutoForm';

import { getAuctionEndTime } from '/imports/api/loanrequests/methods';
import cleanMethod from '/imports/api/cleanMethods';

const getMinDate = serverTime =>
  moment(getAuctionEndTime(serverTime))
    .add(2, 'd')
    .toDate();

const getFormArray = (request, serverTime) => [
  {
    type: 'h3',
    text: 'Derniers réglages',
  },
  {
    id: 'general.wantedClosingDate',
    type: 'dateInput',
    label: 'Date espérée du décaissement',
    minDate: getMinDate(serverTime),
  },
  {
    id: 'logic.auction.mostImportant',
    type: 'selectFieldInput',
    label: 'Critère le plus important',
    options: [
      {
        id: 'speed',
        label: 'Décaissement le plus rapide',
      },
      {
        id: 'price',
        label: 'Coût mensuel le plus bas',
      },
    ],
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
      cleanMethod('updateRequest', object, this.props.loanRequest._id);
    }
  }

  render() {
    return (
      <AutoForm
        inputs={getFormArray(this.props.loanRequest, this.props.serverTime)}
        formClasses="user-form"
        documentId={this.props.loanRequest._id}
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
