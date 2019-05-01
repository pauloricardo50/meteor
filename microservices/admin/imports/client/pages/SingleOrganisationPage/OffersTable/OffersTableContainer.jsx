import React from 'react';
import { compose, withProps, withState } from 'recompose';
import moment from 'moment';

import T from 'core/components/Translation';
import { CollectionIconLink } from 'core/components/IconLink';
import { LOANS_COLLECTION, CONTACTS_COLLECTION } from 'core/api/constants';
import DialogSimple from 'imports/core/components/DialogSimple';
import HtmlPreview from 'core/components/HtmlPreview';

const columnOptions = [
  { id: 'createdAt', label: <T id="offer.createdAt" /> },
  { id: 'loanId', label: <T id="Forms.loan" /> },
  { id: 'status', label: <T id="Forms.status" /> },
  { id: 'contact', label: <T id="Forms.contact" /> },
  { id: 'feedback', label: <T id="Forms.feedback" /> },
];

const makeMapOffer = ({ setOfferDialog }) => (offer) => {
  const {
    _id: offerId,
    createdAt,
    lender: { contact, loan },
    feedback,
  } = offer;
  return {
    id: offerId,
    columns: [
      {
        raw: createdAt,
        label: moment(createdAt).format('DD.MM.YYYY'),
      },
      {
        raw: loan.name,
        label: (
          <CollectionIconLink
            relatedDoc={{ ...loan, collection: LOANS_COLLECTION }}
          />
        ),
      },
      {
        raw: loan.status,
        label: <T id={`Forms.status.${loan.status}`} />,
      },
      {
        raw: contact.name,
        label: (
          <CollectionIconLink
            relatedDoc={{ ...contact, collection: CONTACTS_COLLECTION }}
          />
        ),
      },
      {
        raw: feedback,
        label: feedback ? (
          <DialogSimple closeOnly label="Feedback">
            <h4>Envoyé le {moment(feedback.date).format('D MMM YYYY')}</h4>
            <HtmlPreview value={feedback.message} />
          </DialogSimple>
        ) : (
          'Pas encore de feedback'
        ),
      },
    ],
    handleClick: () => setOfferDialog(offer),
  };
};

export default compose(
  withState('offerDialog', 'setOfferDialog', null),
  withProps(({ offers = [], setOfferDialog }) => ({
    rows: offers.map(makeMapOffer({ setOfferDialog })),
    columnOptions,
  })),
);
